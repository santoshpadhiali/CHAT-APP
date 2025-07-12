import React, { useEffect, useState } from 'react';
import { useChatStor } from '../stor/useChatStor';
import { useAuthStore } from '../stor/useAuthStor';
import SidebarSkeleton from './skeleton/SidebarSkeleton.jsx';
import { Users as UsersIcon } from 'lucide-react';

function Sidebar() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStor();

  const { onlineUsers } = useAuthStore(); // ✅ Zustand global state
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch all users on first render
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter based on "Show online only" toggle
  useEffect(() => {
    if (!users) return;
    const result = showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;
    setFilteredUsers(result);
  }, [users, showOnlineOnly, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Show online toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? 'bg-base-300 ring-1 ring-base-300'
                : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* Name & Status */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </div>
            </div>
          </button>
        ))}

        {/* No Users Message */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No one is Online </div>
        )}
        
      </div>
    </aside>
  );
}

export default Sidebar;
