import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SidebarItemProps, SidebarTemplateProps } from "../../interfaces";
import { motion } from "framer-motion";
import Paths from "../../util/Paths";
import SessionUtil from "../../util/SessionUtil";
import { IoMenu, IoReturnDownBack } from "react-icons/io5";
import ClerkUserButton from "../account-modal/ClerkUserButton";
import steerLogoPath from "../../assets/images/steer_logo_white.png";
import { useRequestArgs } from "../../util/CustomHooks";
import { personAPI } from "../../util/ApiDeclarations";
import { PersonDto } from "../../../client";

const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  items,
  showReturn,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [opened, setOpened] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const requestArgs = useRequestArgs();
  const [person, setPerson] = useState<PersonDto | undefined>(undefined);

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

  useEffect(() => {
    getPerson();
  }, [user]);

  const getPerson = async function () {
    const res = await personAPI.getCurrentPerson(
      await requestArgs.getRequestArgs()
    );
    const person = res.data.person;
    setPerson(person);
  };

  return (
    <motion.div
      animate={{ width: opened ? "350px" : "100px" }}
      initial={{ width: opened ? "350px" : "100px" }}
      transition={{ duration: 0.3 }}
      className={`text-white pb-3 flex items-center flex-col flex-wrap bg-transparent`}
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
              <img alt="steer" src={steerLogoPath} className="h-16" />
            </motion.button>
          </Link>
        )}
        <button onClick={toggle}>
          <IoMenu className="h-10 w-10 fill-white" />
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
      <div className="gap-y-4 items-center w-full mb-2">
        <motion.div
          className={`flex flex-row justify-center gap-x-4`}
          initial={{ visibility: "hidden", opacity: 0 }}
          animate={{ visibility: "visible", opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <ClerkUserButton person={person} />
          {opened && (
            <motion.div
              initial={{ visibility: "hidden", opacity: 0 }}
              animate={{ visibility: "visible", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex flex-col items-start justify-center"
            >
              <div className="text-white font-semibold text-lg flex flex-row items-center gap-x-1">
                <p>{user?.fullName}</p>
                {person?.admin && (
                  <p className="text-danger text-sm">(admin)</p>
                )}
              </div>
              <div className="text-white font-normal text-sm">
                <p>{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
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
            ? "flex flex-row items-center tracking-wider text-black bg-white py-3 rounded-l-full h-20 font-semibold pl-4"
            : "h-20 flex flex-row items-center hover:fill-black tracking-wider bg-transparent py-3 hover:text-black font-semibold hover:bg-white hover:rounded-l-full"
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
