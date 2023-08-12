import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Slider,
  Space,
  Switch,
} from "antd";
import React from "react";
import { useProducts } from "../../../hooks";
import { SliderMarks } from "antd/es/slider";
import { ProductFormData } from "../../../hooks/useProducts";

interface ProductInfoProps {
  formRef: React.RefObject<FormInstance>;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ formRef }) => {
  const { categories, createProduct, selectedProduct, patchProduct } =
    useProducts();
  const [loading, setLoading] = React.useState(false);

  const onFinish = (values: ProductFormData) => {
    setLoading(true);
    selectedProduct
      ? patchProduct({ ...selectedProduct, ...values }).finally(() =>
          setLoading(false)
        )
      : createProduct(values).finally(() => setLoading(false));
  };

  const marks: SliderMarks = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
  };

  return (
    <>
      <Form
        layout="vertical"
        name="product_info"
        onFinish={onFinish}
        ref={formRef}
      >
        <Space
          direction="vertical"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form.Item
            label="Nome"
            name="title"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do produto",
              },
            ]}
          >
            <Input placeholder="Nome do produto" size="large" />
          </Form.Item>
          <Space>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Por favor, insira uma categoria",
                },
              ]}
              required
              label="Categoria"
              name="product_category"
            >
              <Select
                showSearch
                placeholder="Busque e selecione uma categoria"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .startsWith(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.title,
                }))}
              />
            </Form.Item>
            <Form.Item label="Código Produto" name="codigo_produto">
              <Input />
            </Form.Item>
          </Space>
          <Form.Item
            label="serve quantas pessoas?"
            name="size"
            initialValue={1}
          >
            <Slider defaultValue={0} min={0} max={6} marks={marks} />
          </Form.Item>
          <Space
            direction="horizontal"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Item
              label="Preço"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o preço do produto",
                },
              ]}
              initialValue={"0"}
              style={{
                width: "100%",
              }}
            >
              <InputNumber
                size="large"
                min={"0" as string}
                style={{
                  width: "80%",
                }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              label="Ordem de visualização"
              name="order"
              initialValue={0}
            >
              <InputNumber
                min={"0" as string}
                size="large"
                style={{
                  width: "80%",
                }}
              />
            </Form.Item>
            <Form.Item
              label="Tempo de preparo"
              name="preparation_time"
              tooltip="Tempo de preparo em minutos"
              initialValue={0}
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o tempo de preparo do produto",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={"0" as string}
                style={{
                  width: "80%",
                }}
              />
            </Form.Item>
          </Space>
          <Form.Item
            label="Codigo de barras"
            name="ean"
            tooltip="Codigo de barras do produto"
          >
            <Input size="large" />
          </Form.Item>
          <Space
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "60px",
            }}
          >
            <Form.Item
              label="ativo"
              name="active"
              tooltip="Se o produto está ativo ele está disponivel para lançamento de pedidos"
              initialValue={true}
            >
              <Switch
                checkedChildren="Sim"
                unCheckedChildren="Não"
                defaultChecked
              />
            </Form.Item>
            <Form.Item
              label="Será visualizado no site?"
              name="listed"
              tooltip="Se aparecerá no catalogo online!"
              initialValue={true}
            >
              <Switch
                checkedChildren="Sim"
                unCheckedChildren="Não"
                defaultChecked
              />
            </Form.Item>
            <Form.Item
              label="tipo de venda"
              name="type_of_sale"
              required
              tooltip="Se o produto é vendido por peso, medida ou unidade"
            >
              <Select
                // onChange={handleChange}
                defaultValue={"UN"}
                options={[
                  { value: "KG", label: "Quilograma" },
                  { value: "L", label: "Litro" },
                  { value: "UN", label: "Unidade" },
                ]}
              />
            </Form.Item>
          </Space>
          <Form.Item label="Descrição" name="description">
            <Input.TextArea rows={4} placeholder="Descrição do produto" />
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
              danger
              style={{ width: "100%" }}
            >
              Cancelar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
              loading={loading}
            >
              {selectedProduct ? "Salvar" : "Próximo"}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
