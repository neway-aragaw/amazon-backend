export const initialState = {
  basket: [],
  user: null
};

export const getBasketTotal = (basket) => 
  basket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
    
    case 'EMPTY_BASKET':
      return {
        ...state,
        basket: []
      }

    case "REMOVE_FROM_BASKET":
//   The reducer function first uses the findIndex method to find the index of the item to be removed in the "basket" array of the state. The findIndex method returns the index of the first element in the array that satisfies the provided testing function, or -1 if no element passes the test.
// If the index of the item to be removed is found (i.e., if "index" is greater than or equal to 0), the reducer function uses the splice method to remove the item from the "basket" array.
// If the item is not found in the "basket" array, a warning is logged to the console using console.warn.
// Finally, the reducer function returns a new state object with the updated "basket" array.
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);

      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        )
      }

      return {
        ...state,
        basket: newBasket
      }
    
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }

    default:
      return state;
  }
};

export default reducer;