import { Drawer, FormInstance, Tabs, TabsProps } from "antd";
import React, { useEffect } from "react";
import { useProducts } from "../../hooks";
import { ProductInfo } from "./components/ProductInfo";
import { ProductFiscal } from "./components/ProductFiscal";
import { ProductComplement } from "./components/ProductComplement";

interface DrawerProductProps {
  visible: boolean;
  onClose: () => void;
}

export const DrawerProduct: React.FC<DrawerProductProps> = ({
  onClose,
  visible,
}) => {
  const {
    fetchCategories,
    currentTab,
    selectedProduct,
    setSelectedProduct,
    setCurrentTab,
  } = useProducts();
  const formRef = React.useRef<FormInstance>(null);
  const formFiscalRef = React.useRef<FormInstance>(null);

  useEffect(() => {
    fetchCategories();
    if (selectedProduct) {
      formRef.current?.setFieldsValue(selectedProduct);
      formFiscalRef.current?.setFieldsValue(selectedProduct);
    }
  }, [visible, selectedProduct]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <h4>Informações básicas</h4>,
      children: <ProductInfo formRef={formRef} />,
      disabled: `${currentTab}` !== "1" && selectedProduct == null,
    },
    {
      key: "2",
      label: <h4>Fiscal</h4>,
      children: <ProductFiscal formRef={formFiscalRef} />,
      disabled: `${currentTab}` !== "2" && selectedProduct == null,
    },
    {
      key: "3",
      label: <h4>Complementos</h4>,
      children: <ProductComplement />,
      disabled: `${currentTab}` !== "3" && selectedProduct == null,
    },
  ];

  return (
    <>
      <Drawer
        title={selectedProduct ? "Editar produto" : "Criar produto"}
        width={800}
        placement="right"
        onClose={() => {
          onClose();
          setSelectedProduct(null);
          setCurrentTab(1);
          formRef.current?.resetFields();
        }}
        open={visible}
        bodyStyle={{ padding: "0 20px" }}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          activeKey={`${currentTab}`}
          onTabClick={(key) => {
            setCurrentTab(parseInt(key));
          }}
        />
      </Drawer>
    </>
  );
};
