import { Button, Typography } from "antd";
import React from "react";
import { formatToBRL } from "../../../../utils";

interface CheckBoxComplementProps {
  title: string;
  selcteds: string[];
  onChange: (value: string[]) => void;
  max?: number;
  items: {
    id: string;
    title: string;
    price: number;
  }[];
}

export const CheckBoxComplement: React.FC<CheckBoxComplementProps> = ({
  title,
  items,
  max,
  onChange,
  selcteds,
}) => {
  return (
    <div>
      <Typography.Title level={5}>{title}</Typography.Title>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        {items.map((item) => (
          <Button
            key={item.id}
            type={selcteds.includes(item.id) ? "primary" : "default"}
            size="large"
            onClick={() => {
              if (selcteds.includes(item.id)) {
                onChange(selcteds.filter((id) => id !== item.id));
              } else {
                if (max) {
                  if (selcteds.length < max) {
                    onChange([...selcteds, item.id]);
                  }
                } else {
                  onChange([...selcteds, item.id]);
                }
              }
            }}
          >
            {`${item.title} - ${formatToBRL(`${item.price}`)}`}
          </Button>
        ))}
      </div>
    </div>
  );
};
