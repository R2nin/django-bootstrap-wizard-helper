
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { ContentRenderer } from "./ContentRenderer";
import { User } from "@/types/user";
import { useMainAppLogic } from "@/hooks/useMainAppLogic";

interface MainAppProps {
  currentUser: User;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  const {
    currentSection,
    setCurrentSection,
    editingItem,
    patrimonyItems,
    patrimonyLoading,
    suppliers,
    users,
    logs,
    handleAddItem,
    handleAddItemWithChapa,
    handleImportItems,
    handleUpdateItem,
    handleDeleteItem,
    handleEditItem,
    handleCancelEdit,
    handleAddSupplier,
    handleDeleteSupplier,
    handleAddUser,
    handleDeleteUser,
    handleAddLocation
  } = useMainAppLogic(currentUser);

  console.log('MainApp - Patrimony items:', patrimonyItems.length);
  console.log('MainApp - Loading:', patrimonyLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onLogout={onLogout}
        onAddLocation={() => setCurrentSection('location-form')}
      />
      <div className="flex">
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          userRole={currentUser.role}
        />
        <main className="flex-1 p-6">
          <ContentRenderer
            currentSection={currentSection}
            patrimonyLoading={patrimonyLoading}
            patrimonyItems={patrimonyItems}
            suppliers={suppliers}
            users={users}
            logs={logs}
            editingItem={editingItem}
            onAddItem={handleAddItem}
            onAddItemWithChapa={handleAddItemWithChapa}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            onCancelEdit={handleCancelEdit}
            onImportItems={handleImportItems}
            onAddSupplier={handleAddSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onAddLocation={handleAddLocation}
            onSectionChange={setCurrentSection}
          />
        </main>
      </div>
    </div>
  );
};
