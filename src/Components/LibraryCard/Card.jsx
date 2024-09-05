import ButtonComp from "../Button/Button";
import { Typography, Avatar, Spinner } from "@material-tailwind/react";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { useBookContext } from "../../Context/Book.context";
import { useEffect, useState } from "react";
import EditBookModal from "../EditBookModal/EditBookModal.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function CardComp() {
  const { books, loading } = useBookContext();
  const [bookId, setBookId] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [selectedBookAuthor, setSelectedBookAuthor] = useState("");
  const [selectedBookDescription, setSelectedBookDescription] = useState("");
  const [selectedBookPrice, setSelectedBookPrice] = useState("");
  const [selectedBookPublishDate, setSelectedBookPublishDate] = useState("");

  const handleOpen = (id, title, author, description, price, date) => {
    setOpen(!open);
    setBookId(id);
    setSelectedBookTitle(title);
    setSelectedBookAuthor(author);
    setSelectedBookDescription(description);
    setSelectedBookPrice(price);
    setSelectedBookPublishDate(date);
  };

  useEffect(() => {
    if (books.foundedBook && books.foundedBook.length > 0) {
      setBooksData(books.foundedBook);
    }
  }, [books]);

  const deleteBook = (id) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/deleteBook/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Book deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Please try again!");
      });
  };

  return (
    <div className="mx-auto max-w-screen-2xl mt-10">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner className="w-16 h-16 lg:h-32 lg:w-32" />
        </div>
      ) : (
        <>
          <div className="booksCard w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {booksData.length === 0 ? (
              <Typography
                variant="h5"
                className="font-medium text-gray-900 transition-all duration-300"
              >
                No Data Found!
              </Typography>
            ) : (
              booksData.map((book) => (
                <div
                  key={book._id}
                  className="flex flex-col items-start p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Avatar
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="Book Cover"
                    variant="rounded"
                    className="w-full h-48 object-cover mb-4"
                  />
                  <div className="flex flex-col justify-between items-start w-full gap-1">
                    <Typography
                      variant="h3"
                      className="font-semibold text-gray-900 mb-1"
                    >
                      {book.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-gray-900 mb-1 font-semibold"
                    >
                      Author: {book.author}
                    </Typography>
                    <Typography
                      variant="paragraph"
                      className="text-gray-900 mb-1 font-medium"
                    >
                      {book.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-gray-900 mb-1 font-semibold"
                    >
                      Rs /- {book.price}
                    </Typography>
                    <div className="flex flex-col gap-4 mt-auto w-full">
                      <ButtonComp
                        title="Edit"
                        btnIcon={<FiEdit2 size={20} />}
                        btnClick={() =>
                          handleOpen(
                            book._id,
                            book.title,
                            book.author,
                            book.description,
                            book.price,
                            book.publishDate
                          )
                        }
                      />
                      <ButtonComp
                        title="Delete"
                        btnIcon={<MdOutlineDelete size={20} />}
                        btnClick={() => deleteBook(book._id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <EditBookModal
        open={open}
        handleOpen={handleOpen}
        bookId={bookId}
        selectedBookTitle={selectedBookTitle}
        selectedBookAuthor={selectedBookAuthor}
        selectedBookDescription={selectedBookDescription}
        selectedBookPrice={selectedBookPrice}
        selectedBookPublishDate={selectedBookPublishDate}
      />
    </div>
  );
}

export default CardComp;
