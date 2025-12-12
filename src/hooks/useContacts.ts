import { useState, useEffect } from 'react';
import { Contact } from '@/types/contact';

const STORAGE_KEY = 'contact-book-contacts';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setContacts(parsed.map((c: Contact) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (newContacts: Contact[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
  };

  const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    saveToStorage(updated);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
    const updated = contacts.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    setContacts(updated);
    saveToStorage(updated);
  };

  const deleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    saveToStorage(updated);
  };

  const searchContacts = (query: string) => {
    if (!query.trim()) return contacts;
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query) ||
      c.company?.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
  };
}