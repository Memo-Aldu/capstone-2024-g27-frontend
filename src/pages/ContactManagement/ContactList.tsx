import { FC } from 'react';
import { IContact } from './ContactReducer';
interface ContactListProps {
  contacts: IContact[];
}
const ContactList: FC<ContactListProps> = ({ contacts }) => {
  return (
    <div className='contacts-list'>
      <h3 className='contacts-list-title'>List of Contacts</h3>
      <div className='contacts-list-table-container'>
        <table className='contacts-list-table'>
          <thead className='contacts-list-header'>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(({ firstName, lastName, email, phone },index) => (
              <tr key={index}>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{email}</td>
                <td>{phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ContactList;
