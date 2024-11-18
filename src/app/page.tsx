"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import ProductUpdateForm from "@/components/ProductUpdateForm";
import ProductView from "@/components/ProductView";

const PageTable = () => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Box px={2}>
      <Tabs
        variant="soft-rounded"
        colorScheme="green"
        fontSize={"0.8rem"}
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab fontSize={"0.8rem"}>Precio</Tab>
          <Tab fontSize={"0.8rem"}>Actualizacion</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProductView tabIndex={tabIndex} />
          </TabPanel>
          <TabPanel>
            <ProductUpdateForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PageTable;
