"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ContactSection from "../sections/ContactSection/ContactSection";
import TextParallaxContent from "@/components/TextParallaxContent/TextParallaxContext";
import { FaWhatsapp } from "react-icons/fa";
import ChavoyaBannerSection from "../sections/ChavoyaBannerSection/ChavoyaBannerSection";

interface CategoriesType {
  Nombre: string;
}

interface BrandsType {
  Nombre: string;
}

interface ProductsType {
  id_page: string;
  Descripcion: string;
  Marca: string;
  Dimensiones: string;
  Categoria: string;
  Ficha: string;
  Peso: number | string;
  Precio: number;
  Imagen: string;
  Nombre: string;
}

export default function Page() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductsType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Categoría");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [brands, setBrands] = useState<BrandsType[]>([]);
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const [responseCategories, responseProducts, responseMarca] =
          await Promise.all([
            fetch("/api/categoriasProductos"),
            fetch("/api/productos"),
            fetch("/api/marca"),
          ]);

        const [dataCategories, dataProducts, dataBrand] = await Promise.all([
          responseCategories.json(),
          responseProducts.json(),
          responseMarca.json(),
        ]);

        if (
          dataCategories.response &&
          dataProducts.response &&
          dataBrand.response
        ) {
          setCategories(dataCategories.response);
          setProducts(dataProducts.response);
          setBrands(dataBrand.response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((br) => br !== brand)
        : [...prev, brand]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(product.Categoria)
      : true;
    const matchesBrand = selectedBrands.length
      ? selectedBrands.includes(product.Marca)
      : true;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="bg-white">
        <TextParallaxContent
          imgUrl="/assets/imgAbout_Header.jpg"
          heading="Productos Hidráulicos"
          subheading="Para Optimizar tus Operaciones Industriales"
        >
          <section className="bg-gray-100 px-4 md:px-8 lg:px-16 py-12">
            <div className="flex md:flex-row flex-col gap-8">
              {/* Filters */}
              <div className="md:w-1/4">
                <div className="bg-white shadow-lg p-6 rounded-lg">
                  <div className="flex mb-4">
                    {["Categoría", "Marca", "Nombre"].map((tab) => (
                      <button
                        key={tab}
                        className={`flex-1 py-2 px-4 text-center ${
                          activeTab === tab
                            ? "bg-[#2D3688] text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  {activeTab === "Categoría" && (
                    <div className="space-y-2">
                      {loading
                        ? Array(8)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <input type="checkbox" className="rounded" />
                                <label>Cargando...</label>
                              </div>
                            ))
                        : categories.map((category, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(
                                  category.Nombre
                                )}
                                onChange={() =>
                                  handleCategoryChange(category.Nombre)
                                }
                                className="rounded"
                              />
                              <label>{category.Nombre}</label>
                            </div>
                          ))}
                    </div>
                  )}
                  {activeTab === "Marca" && (
                    <div className="space-y-2">
                      {loading
                        ? Array(15)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <input type="checkbox" className="rounded" />
                                <label>Cargando</label>
                              </div>
                            ))
                        : brands.map((brand, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand.Nombre)}
                                onChange={() => handleBrandChange(brand.Nombre)}
                                className="rounded"
                              />
                              <label>{brand.Nombre}</label>
                            </div>
                          ))}
                    </div>
                  )}
                  {activeTab === "Nombre" && (
                    <input
                      type="text"
                      placeholder="Buscar por nombre"
                      className="p-2 border rounded w-full"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  )}
                </div>
              </div>

              {/* Product List */}
              <div className="md:w-3/4">
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {loading
                    ? Array(15)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="bg-white shadow-lg p-4 rounded-lg animate-pulse cursor-pointer"
                          >
                            {/* Loading State */}
                          </div>
                        ))
                    : filteredProducts.map((product, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white shadow-lg p-4 rounded-lg cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {/* Product Details */}
                          <div className="w-[200px] aspect-square mx-auto mb-4 overflow-hidden relative">
                            <Image
                              src={`${product.Imagen}`}
                              alt={product.Nombre}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="mb-1 text-[#2D3688] text-sm">
                            {product.Marca}
                          </p>
                          <h3 className="mb-2 font-bold text-gray-900 text-xl">
                            {product.Nombre}
                          </h3>
                          <div className="flex flex-row justify-center items-center w-full">
                            <a
                              target="_blank"
                              href={`https://wa.me/523318937866?text=${encodeURIComponent(
                                `Hola, estoy interesado en ${product.Nombre}`
                              )}`}
                              className="flex flex-col bg-green-500 hover:bg-green-600 py-2 rounded-lg w-1/2 font-bold text-center text-white transition-colors"
                            >
                              <div className="flex justify-center items-center">
                                <span className="mr-2">COTIZAR</span>
                                <FaWhatsapp />
                              </div>
                            </a>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </div>
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
                >
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                  >
                    <h2
                      className="mb-4 font-light text-2xl"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {selectedProduct.Nombre}
                    </h2>
                    <div className="gap-6 grid md:grid-cols-2">
                      <div className="w-[400px] aspect-square rounded-lg overflow-hidden relative">
                        <Image
                          src={`${selectedProduct.Imagen}`}
                          alt={selectedProduct.Nombre}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p
                          className="mb-4 text-lg"
                          style={{ fontFamily: "Verdana, sans-serif" }}
                        >
                          Descripción:{" "}
                          {selectedProduct.Descripcion
                            ? selectedProduct.Descripcion
                            : "Sin descripcion disponible"}
                        </p>

                        <p
                          className="mb-4 font-semibold text-lg"
                          style={{ fontFamily: "Verdana, sans-serif" }}
                        >
                          {selectedProduct.Precio
                            ? `USD $${selectedProduct.Precio.toFixed(2)}`
                            : "No Disponible"}
                        </p>
                        <a
                          // whileHover={{ scale: 1.05 }}
                          // whileTap={{ scale: 0.95 }}
                          target="_blank"
                          href={`${selectedProduct.Ficha}`}
                          className="flex justify-center items-center bg-[#2D3688] mb-4 px-4 py-2 rounded-full text-white cursor-pointer"
                        >
                          {/* <Download className="mr-2" /> */}
                          Ver la ficha técnica
                        </a>

                        <a
                          target="_blank"
                          href={`https://wa.me/523318937866?text=${encodeURIComponent(
                            `Hola, estoy interesado en ${selectedProduct.Nombre}`
                          )}`}
                          // className='flex flex-col bg-green-500 hover:bg-green-600 py-2 rounded-lg w-1/2 font-bold text-center text-white transition-colors'
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex justify-center items-center bg-green-500 px-6 py-3 rounded-full w-full font-semibold text-lg text-white"
                          >
                            {/* <WhatsApp className="mr-2" /> */}
                            Contactar via WhatsApp
                          </motion.button>
                        </a>
                      </div>
                    </div>
                    <button
                      className="top-4 right-4 absolute text-2xl"
                      onClick={() => setSelectedProduct(null)}
                    >
                      &times;
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </section>
        </TextParallaxContent>
        <ChavoyaBannerSection />
        <ContactSection />
      </div>
    </div>
  );
}
