import {
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useProducts } from "../../lib/hooks";
import cn from "../../utils";

function formatPrice(price: number) {
  return price.toLocaleString("en-IN", {
    currency: "INR",
    style: "currency",
  });
}

export default function ProductsPage() {
  const { loading, products } = useProducts({});
  return (
    <main className="p-5 md:p-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold font-serif">Products</h1>
      </div>

      <section>
        {loading ? (
          <div className="w-full text-center ">Loading...</div>
        ) : (
          <section className="grid grid-cols-4 gap-5 md:gap-10 py-10">
            {products.map((product) => (
              <Card
                as={Link}
                to={`/${product.id}`}
                className="py-4 bg-neutral-100 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer hover:shadow-lg"
                radius="sm"
                key={product.id}
              >
                <CardHeader className="pb-0 pt-0 px-4 flex-col items-start relative">
                  <Chip className="absolute right-3 top-0 font-semibold bg-neutral-200">
                    {product.company}
                  </Chip>

                  <h4 className="font-bold text-xl">{product.productName}</h4>

                  <span className="flex items-end gap-1">
                    <p className="font-semibold text-lg">
                      {formatPrice(product.price)}
                    </p>

                    {product.discount > 0 && (
                      <p>
                        <span className="text-sm text-neutral-500 line-through ">
                          {formatPrice(
                            product.price +
                              product.price * (product.discount / 100)
                          )}
                        </span>{" "}
                        <span className=" text-green-500 font-semibold">
                          {product.discount}%
                        </span>
                      </p>
                    )}
                  </span>

                  <span>
                    <p className="text-sm text-neutral-600 align-middle font-medium">
                      ⭐{product.rating}
                    </p>
                  </span>
                </CardHeader>
                <CardBody className="overflow-visible flex items-center justify-center">
                  <Image
                    alt="Card background"
                    src="https://nextui.org/images/hero-card-complete.jpeg"
                  />
                </CardBody>
                <CardFooter>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      product.availability === "yes"
                        ? "text-success"
                        : "text-danger"
                    )}
                  >
                    {product.availability === "yes"
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

function FiltersModal() {
  return (
    <>
      <Button color="primary" variant="bordered">
        Filters
      </Button>
      <Modal>
        <ModalContent>
          <ModalHeader>Filters</ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button fullWidth color="primary">
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
