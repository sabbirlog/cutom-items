import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: Readonly<ProductCardProps>) {
  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
        Add to Cart
      </button>
    </div>
  );
}
