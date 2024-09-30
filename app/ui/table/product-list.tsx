import { ListProps } from "./product-list.type";

export default function ProductList({
  name,
  description,
  price,
  category,
  brand,
}: ListProps) {
  return (
    
        <tr >
          <td className="text-center p-3 text-sm">{name}</td>
          <td className="text-center p-3 text-sm">{description}</td>
          <td className="text-center p-3 text-sm">{price}</td>
          <td className="text-center p-3 text-sm">{category}</td>
          <td className="text-center p-3 text-sm">{brand}</td>
        </tr>
   
   
  );
}
