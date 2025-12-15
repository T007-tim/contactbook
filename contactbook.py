
#This is a Simple Contact Book Application in Python

contact_book = {}

def add_contact():
    name = input("Enter name: ").strip()
    phone = input("Enter phone number: ").strip()
    email = input("Enter email: ").strip()
    
    contact_book[name] = {
        "phone": phone,
        "email": email
    }
    print(f"\n✔ Contact '{name}' added successfully!\n")
    
#View  all contacts available
def view_contacts():
    if not contact_book:
        print("\nNo contacts found.\n")
        return
    
    print("\n------ Contact List ------")
    for name, info in contact_book.items():
        print(f"Name: {name}")
        print(f"Phone: {info['phone']}")
        print(f"Email: {info['email']}")
        print("----------------------------")
    print()
#Search for a contact
def search_contact():
    name = input("Enter the name to search: ").strip()
    
    if name in contact_book:
        print("\n✔ Contact found!")
        print(f"Name: {name}")
        print(f"Phone: {contact_book[name]['phone']}")
        print(f"Email: {contact_book[name]['email']}\n")
    else:
        print("\n✘ Contact not found.\n")

def delete_contact():
    name = input("Enter the name to delete: ").strip()
    
    if name in contact_book:
        del contact_book[name]
        print(f"\n✔ Contact '{name}' deleted successfully!\n")
    else:
        print("\n✘ Contact not found.\n")

def menu():
    while True:
        print("===== CONTACT BOOK MENU =====")
        print("1. Add Contact")
        print("2. View Contacts")
        print("3. Search Contact")
        print("4. Delete Contact")
        print("5. Exit")
        
        choice = input("Choose an option (1-5): ")

        if choice == "1":
            add_contact()
        elif choice == "2":
            view_contacts()
        elif choice == "3":
            search_contact()
        elif choice == "4":
            delete_contact()
        elif choice == "5":
            print("\nGoodbye!\n")
            break
        else:
            print("\nInvalid choice, please try again.\n")

# Run the program
menu()
