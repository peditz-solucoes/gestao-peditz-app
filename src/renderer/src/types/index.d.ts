export type Product = {
  id: string;
  created: string;
  modified: string;
  complemet_limit: number;
  codigo_ncm: string;
  valor_unitario_comercial: string;
  valor_unitario_tributavel: string;
  product_tax_description: string;
  unidade_comercial: "KG" | "L" | "UN";
  unidade_tributavel: "KG" | "L" | "UN";
  icms_origem: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  icms_situacao_tributaria: "102" | "103" | "300" | "400" | "500" | "900";
  icms_aliquota: string;
  icms_base_calculo: string;
  icms_modalidade_base_calculo: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  category: productCategory;
  printer: number;
  title: string;
  product_category: string;
  codigo_produto?: string;
  size?: number;
  price: string;
  order?: number;
  preparation_time?: number;
  ean?: string;
  active?: boolean;
  listed?: boolean;
  type_of_sale: "KG" | "L" | "UN";
  description?: string;
};

export type ProductComplement = {
  id?: string;
  title: string;
  order: number;
  active: boolean;
  input_type: "checkbox" | "radio" | "increment";
  business_rules: "maior" | "soma" | "media";
  max_value: number;
  min_value: number;
  product: string;
  complement_items?: productComplementItem[];
};

export type ProductComplementItem = {
  id?: string;
  title: string;
  order: number;
  active: boolean;
  price: string;
  max_value: number;
  min_value: number;
  complement_product?: string;
};

export type ProductCategory = {
  id?: string;
  created?: string;
  modified?: string;
  title: string;
  order: number;
  restaurant?: string;
}

export type Tables = {
  id?: string,
  bills: [
    {
      id: string,
      number: number,
      open: boolean,
      client_name: string,
    }
  ],
  created?: string;
  modified?: string;
  title: string;
  description?: string,
  order: number;
  active: boolean,
  capacity: number,
  restaurant?: string
}

export type Cashier = {
  id?: string,
  open: boolean,
  identifier: string,
  initial_value: string,
  closed_at: string,
  opened_by: {
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
  },
  opened_by_name: string,
  closed_by?: {
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
  },
  closed_by_name?: string,
  restaurant: {
    id: string,
    title: string,
  },
  created: string;
  modified?: string;
}

export type Bill = {
  id?: string,
  tip: string,
  opened_by: {
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
  },
  opened_by_name: string,
  table: string,
  cashier: string,
  created: string;
  modified?: string;
  open: boolean,
  client_name: string,
  client_phone: string,
  number: number,
  table_datail: {
    id: string,
    title: string,
  }
}

export type Employer = {
  id?: string,
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  cpf: string,
  address: string,
  phone: string,
  office: string,
  sallary: number,
  active: boolean,
  code: string,
  role: string,
  sidebar_permissions: string[],
}

export type OrderGroupList = {
  id?: string,
  created?: string,
  collaborator_name: string,
  total: string,
  order_number: number,
  type: string,
  orders: OrderList[],
}

export type OrderList = {
  id?: string,
  product_title: string,
  quantity: string,
  unit_price: string,
  note: string,
  total: string,
  complements: OrderComplementList[],
}

export type OrderComplementList = {
  id?: string,
  complement_group_title: string,
  items: OrderComplementItemList[],
  total: string,
}

export type OrderComplementItemList = {
  id?: string,
  complement_title: string,
  quantity: string,
  unit_price: string,
  total: string,
}

export type FormOfPayment = {
  id?: string,
  created?: string,
  modified?: string,
  method: string,
  title: string,
  active: boolean,
  order: number,
  tax_percentage: string,
  tax: string,
  payout_schedule: number,
  restaurant?: string,
}