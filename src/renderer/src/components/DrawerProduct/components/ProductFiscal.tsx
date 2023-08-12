import { Button, Form, FormInstance, Input, Space } from "antd";
import React from "react";
import { useProducts } from "../../../hooks";

type type_of_sale = "KG" | "L" | "UN";
interface FiscalProductProps {
  codigo_ncm?: string;
  valor_unitario_comercial?: string;
  valor_unitario_tributavel?: string;
  product_tax_description?: string;
  unidade_comercial?: type_of_sale;
  unidade_tributavel?: type_of_sale;
  icms_origem?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  icms_situacao_tributaria?: "102" | "103" | "300" | "400" | "500" | "900";
  icms_aliquota?: string;
  icms_base_calculo?: string;
  icms_modalidade_base_calculo?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  icms_valor?: string;
}

interface FormFiscalProductProps {
  formRef: React.RefObject<FormInstance>;
}

export const ProductFiscal: React.FC<FormFiscalProductProps> = ({
  formRef,
}) => {
  const { setCurrentTab, currentTab, patchProduct } = useProducts();

  const handleSubmit = (values: FiscalProductProps) => {
    patchProduct({
      ...values,
    });
  };

  return (
    <>
      <Form onFinish={handleSubmit} layout="vertical" ref={formRef}>
        <Form.Item label="Código NCM" name="codigo_ncm">
          <Input />
        </Form.Item>
        <Space>
          <Form.Item
            label="Valor Unitário Comercial"
            name="valor_unitario_comercial"
          >
            <Input />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item
            label="Valor Unitário Tributável"
            name="valor_unitario_tributavel"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Tax Description"
            name="product_tax_description"
          >
            <Input />
          </Form.Item>
          <Form.Item label="Unidade Comercial" name="unidade_comercial">
            <Input />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="Unidade Tributável" name="unidade_tributavel">
            <Input />
          </Form.Item>
          <Form.Item label="ICMS Origem" name="icms_origem">
            <Input />
          </Form.Item>
          <Form.Item
            label="ICMS Situação Tributária"
            name="icms_situacao_tributaria"
          >
            <Input />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="ICMS Alíquota" name="icms_aliquota">
            <Input />
          </Form.Item>
          <Form.Item label="ICMS Base de Cálculo" name="icms_base_calculo">
            <Input />
          </Form.Item>
          <Form.Item
            label="ICMS Modalidade de Base de Cálculo"
            name="icms_modalidade_base_calculo"
          >
            <Input />
          </Form.Item>
        </Space>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Form.Item>
            <Button
              type="default"
              size="large"
              style={{ width: "100%" }}
              onClick={() => setCurrentTab(currentTab - 1)}
            >
              Voltar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
            >
              Salvar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
