import { UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { FaUsersCog } from "react-icons/fa";
import ManageUsersModal from "./admin-modal/ManageUsersModal";
import { ClerkUserButtonProps } from "../../interfaces";

export default function ClerkUserButton({ person }: ClerkUserButtonProps) {
  const [manageUsersModalOpen, setManageUsersModalOpen] =
    useState<boolean>(false);

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10",
    },
  };

  return (
    <div className="flex items-center justify-center ">
      {person && (
        <>
          <UserButton appearance={userButtonAppearance}>
            <UserButton.MenuItems>
              {person.admin && (
                <UserButton.Action
                  label="Manage users (admin)"
                  labelIcon={<FaUsersCog className="size-4" />}
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
        </>
      )}
    </div>
  );
}
