import { AppContext } from "../App";
import { useContext, useRef } from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../App.css";

const Dashboard = () => {
  const tabPanelDivRef = useRef();

  const { username } = useContext(AppContext);
  return (
    <Tabs>
      <TabList>
        <Tab
          style={{
            marginLeft: tabPanelDivRef.current.getBoundingClientRect().x + "px",
          }}
        >
          Projects
        </Tab>
        <Tab disabled>Workspaces (Paid Feature)</Tab>
      </TabList>

      <div ref={tabPanelDivRef} style={{ maxWidth: "800px", margin: "auto" }}>
        <TabPanel>
          <h2>Projects {username}</h2>
        </TabPanel>
        <TabPanel>
          <h2>Paid only</h2>
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default Dashboard;
