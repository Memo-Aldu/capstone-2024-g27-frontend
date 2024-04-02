  export interface IContact {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }
  export interface Action {
    type: 'ADD_CONTACT'
    payload: 
    IContact;
  }
  export interface State {
    contacts: IContact[];
  }
  export const contactsReducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'ADD_CONTACT':
        return {
          ...state,
          contacts: [...state.contacts, action.payload]
        };
      default:
        return state;
    }
  };