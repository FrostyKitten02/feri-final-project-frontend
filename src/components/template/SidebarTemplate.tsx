import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { SidebarItemProps, SidebarTemplateProps } from "../../interfaces";
import { motion } from "framer-motion";
import Paths from "../../util/Paths";
import SessionUtil from "../../util/SessionUtil";
import ManageUsersModal from "../admin-modal/ManageUsersModal";
import ManageProjectModal from "../project-main/project-settings/ManageProject";
import {IoMenu, IoReturnDownBack} from "react-icons/io5";

const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  items,
  showReturn,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [opened, setOpened] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useUser();

  const { projectId } = useParams();

  const toggle = (): void => {
    const newStatus: boolean = !opened;
    SessionUtil.setSidebarStatus(!SessionUtil.getSidebarStatus || newStatus);
    setOpened(newStatus);
  };
  const handleSidebarSelect = (value: string): void => {
    setSelected(value);
    SessionUtil.setSidebarSelect(value);
  };
  const handleReturn = () => {
    navigate(Paths.HOME);
    SessionUtil.setSidebarSelect("");
  };

  useEffect(() => {
    const sidebarSelect: string | undefined = SessionUtil.getSidebarSelect();
    const sidebarStatus: boolean | undefined = SessionUtil.getSidebarStatus();
    if (sidebarSelect === undefined) SessionUtil.setSidebarSelect("");
    setSelected(sidebarSelect || "");
    if (sidebarStatus === undefined) {
      SessionUtil.setSidebarStatus(true);
      setOpened(true);
    } else setOpened(sidebarStatus);
  }, []);

  return (
    <motion.div
      animate={{ width: opened ? "18%" : "6%" }}
      initial={{ width: opened ? "18%" : "6%" }}
      transition={{ duration: 0.3 }}
      className={`h-full text-white pb-3 flex items-center flex-col flex-wrap bg-transparent`}
    >
      <div
        className={
          opened
            ? `h-28 w-full py-5 flex flex-row items-center justify-around`
            : `h-28 w-full py-5 flex flex-row items-center justify-center`
        }
      >
        {opened && (
          <Link to={Paths.HOME}>
            <motion.button
              initial={{ visibility: "hidden", opacity: 0 }}
              animate={{ visibility: "visible", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              onClick={() => handleSidebarSelect("dashboard")}
              className="flex items-center space-x-4"
            >
              <div className="uppercase tracking-wider text-3xl ">steer</div>
            </motion.button>
          </Link>
        )}
        <button onClick={toggle}>
          <IoMenu className="h-10 w-10 fill-white"/>
        </button>
      </div>
      <div className={`${opened ? "pl-6" : "pl-[20%]"} w-full flex-grow`}>
        {items.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            handleSelect={handleSidebarSelect}
            selected={selected}
            opened={opened}
          />
        ))}
      </div>
      <div className={`py-2 ${opened && `justify-center`} flex flex-col gap-y-6`}>
        {projectId && <ManageProjectModal sidebarOpened={opened} />}
        {user?.id === "user_2fg086sprrUABqywjpB9n31enB2" && (
          <ManageUsersModal sidebarOpened={opened} />
        )}
      </div>

      <div className="flex flex-row justify-center px-6 w-full h-16 rounded-b-[20px]">
        <div className="flex px-3 items-center justify-center ">
          <UserButton />
        </div>
        {opened && (
          <motion.div
            initial={{ visibility: "hidden", opacity: 0 }}
            animate={{ visibility: "visible", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex px-3 flex-col items-center justify-center"
          >
            <div>{user?.fullName}</div>
            <div>{user?.primaryEmailAddress?.emailAddress}</div>
          </motion.div>
        )}
      </div>
      {showReturn && (
        <button onClick={() => handleReturn()} className="w-full py-6">
          <div className="flex flex-row items-center justify-around w-full">
            <IoReturnDownBack className="h-10 w-10 fill-white" />
          </div>
        </button>
      )}
    </motion.div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  handleSelect,
  selected,
  opened,
}) => {
  const select = (): void => {
    handleSelect(item.name);
  };

  return (
    <Link onClick={select} to={item.linkPath} className="group">
      <div
        className={
          selected === item.name
            ? "flex flex-row items-center tracking-wider text-black bg-white py-3 rounded-l-full h-20"
            : "h-20 flex flex-row items-center hover:fill-black tracking-wider bg-transparent py-3 hover:text-black hover:bg-white hover:rounded-l-full"
        }
      >
        {item.iconComponent({
          className:
            selected === item.name
              ? "h-8 w-8 text-black ml-3"
              : "h-8 w-8 text-white group-hover:text-black ml-3",
        })}
        {opened && (
          <motion.div
            initial={{ visibility: "hidden", opacity: 0 }}
            animate={{ visibility: "visible", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="pl-3 text-xl uppercase"
          >
            {item.name}
          </motion.div>
        )}
      </div>
    </Link>
  );
};

export default SidebarTemplate;
