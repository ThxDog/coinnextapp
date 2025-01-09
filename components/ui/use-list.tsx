import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Avatar } from "@telegram-apps/telegram-ui";

type User = {
  _id: string;
  firstName: string;
  points: number;
};

export const UserItemSkeleton = () => {
  return (
    <div className="flex items-center h-20 ml-2">
      <svg
        className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
      <div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"/>
        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"/>
      </div>
    </div>
  );
};

export const UserSkeletonList = () => {
  return (
    <div className="flex flex-col space-y-2 px-4">
      <UserItemSkeleton />
      <UserItemSkeleton />
    </div>
  );
};

const UserItem = ({ _id, firstName, points }: User) => {
  const formatPricePerUpgrade = (profit: number) => {
    if (profit >= 1_000_000_000_000)
      return `+${(profit / 1_000_000_000_000).toLocaleString().slice(0, 3)}T`;
    if (profit >= 1_000_000_000)
      return `+${(profit / 1_000_000_000).toLocaleString().slice(0, 3)}B`;
    if (profit >= 1_000_000)
      return `+${(profit / 1_000_000).toLocaleString().slice(0, 3)}M`;
    if (profit >= 1_000)
      return `+${(profit / 1_000).toLocaleString().slice(0, 3)}K`;
    return `+${profit}`;
  };
  return (
    <>
      <li className="py-4" key={_id}>
        <div className="flex items-center justify-between gap-4">
          <div className="shrink-0">
            <Avatar
              size={48}
              src="https://avatars.githubusercontent.com/u/84640980?v=4"
            />
          </div>

          <div className="flex-1 text-left">
            <p className="text-sm/6 font-medium text-white truncate line-clamp-1">
              {firstName}
            </p>
            <p className="text-xs/6 font-medium text-white">
              {_id.slice(0, 6)}
            </p>
          </div>

          <span className=" w-fit text-sm/6 font-semibold text-white">
            {formatPricePerUpgrade(points)}
          </span>
        </div>
      </li>
    </>
  );
};

export const UserList = ({ users }: { users: User[] }) => {
  return (
    <>
      <ScrollArea.Root className="ScrollAreaRoot">
        <ScrollArea.Viewport className="ScrollAreaViewport">
          <ul className="flex flex-col  divide-y divide-white/10 z-0 divide-solid px-4 bg-white/5">
            {users?.map((user) => {
              return <UserItem key={user._id} {...user} />;
            })}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </ScrollArea.Root>
    </>
  );
};
