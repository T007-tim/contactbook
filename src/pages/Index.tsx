import { useState, useMemo } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { ContactCard } from '@/components/ContactCard';
import { ContactForm } from '@/components/ContactForm';
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, BookUser, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { contacts, addContact, updateContact, deleteContact } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const lowerQuery = searchQuery.toLowerCase();
    return contacts.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(searchQuery) ||
      c.company?.toLowerCase().includes(lowerQuery)
    );
  }, [contacts, searchQuery]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredContacts]);

  const handleSubmit = (data: Omit<Contact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
      toast({
        title: "Contact updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      addContact(data);
      toast({
        title: "Contact added",
        description: `${data.name} has been added to your contacts.`,
      });
    }
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    deleteContact(id);
    toast({
      title: "Contact deleted",
      description: contact ? `${contact.name} has been removed.` : "Contact removed.",
      variant: "destructive",
    });
  };

  const handleOpenForm = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookUser className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Contact Book
                </h1>
                <p className="text-sm text-muted-foreground">
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
                </p>
              </div>
            </div>
            
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts by name, email, phone, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Contacts Grid */}
        {sortedContacts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No contacts yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start building your contact book by adding your first contact.
            </p>
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Contact
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No results found
            </h2>
            <p className="text-muted-foreground">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </main>

      {/* Contact Form Dialog */}
      <ContactForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contact={editingContact}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Index;