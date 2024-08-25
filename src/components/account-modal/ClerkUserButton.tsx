import { UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { FaUsersCog } from "react-icons/fa";
import ManageUsersModal from "./admin-modal/ManageUsersModal";

export default function ClerkUserButton() {
  const { user } = useUser();
  const [manageUsersModalOpen, setManageUsersModalOpen] =
    useState<boolean>(false);

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10",
    },
  };

  return (
    <div className="flex items-center justify-center ">
      <UserButton appearance={userButtonAppearance}>
        <UserButton.MenuItems>
          {user?.id === import.meta.env.VITE_ADMIN_ID && (
            <UserButton.Action
              label="Manage users (admin)"
              labelIcon={<FaUsersCog />}
              onClick={() => setManageUsersModalOpen(true)}
            />
          )}
          <UserButton.Action label="manageAccount" />
          <UserButton.Action label="signOut" />
        </UserButton.MenuItems>
      </UserButton>
      {manageUsersModalOpen && (
        <ManageUsersModal
          modalOpen={manageUsersModalOpen}
          setModalOpen={setManageUsersModalOpen}
        />
      )}
    </div>
  );
}
