
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
// import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        to="/"
        className="text-white-500 mb-4 inline-block"
      >
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {/* <HeartIcon product={product} /> */}
          </div>

          <div className="lg:w-1/2 flex flex-col space-y-6">
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-white-600">{product.description}</p>
            <p className="text-4xl font-extrabold text-white-900">${product.price}</p>

            <div className="flex justify-between">
              <div>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaStore className="mr-2" /> Brand: {product.brand}
                </h1>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaClock className="mr-2" /> Added: {moment(product.createAt).fromNow()}
                </h1>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaStar className="mr-2" /> Reviews: {product.numReviews}
                </h1>
              </div>

              <div>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaStar className="mr-2" /> Ratings: {rating}
                </h1>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaShoppingCart className="mr-2" /> Quantity: {product.quantity}
                </h1>
                <h1 className="flex items-center mb-4 text-white-700">
                  <FaBox className="mr-2" /> In Stock: {product.countInStock}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Ratings
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />

              {product.countInStock > 0 && (
                <select
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-pink-700 ${
                product.countInStock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Add To Cart
            </button>

            <div className="mt-12">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
