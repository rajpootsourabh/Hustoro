
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import test1 from '../assets/test1.jpeg'
import test2 from '../assets/test2.jpeg'
import test3 from '../assets/test3.jpeg'
import testimonial_bg from '../assets/testimonial_bg.png'

const testimonials = [
  { id: 1, name: "James Pattinson",profile:test1, text: "“Lobortis leo pretium facilisis amet nisl at nec. Scelerisque risus tortor donec ipsum consequat semper consequat adipiscing ultrices.”", rating: 4.5 },
  { id: 2, name: "Greg Stuart",profile:test2, text: "“Vestibulum, cum nam non amet consectetur morbi aenean condimentum eget. Ultricies integer nunc neque accumsan laoreet. Viverra nibh ultrices.”", rating: 3.5 },
  { id: 3, name: "Trevor Mitchell",profile:test3, text: "“Ut tristique viverra sed porttitor senectus. A facilisis metus pretium ut habitant lorem. Velit vel bibendum eget aliquet sem nec, id sed. Tincidunt.”", rating: 5 },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1080) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const canScroll = testimonials.length > itemsPerView;

  const startAutoScroll = () => {
    if (canScroll) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % (testimonials.length - (itemsPerView - 1)));
      }, 3000);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, [itemsPerView]);

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div className="w-full h-fit flex  flex-col justify-center items-center sm:px-16 px-2 py-16 bg-cover bg-top" style={{ backgroundImage: `url(${testimonial_bg})` }}>
      <div className="max-w-[1700px] relative w-full overflow-hidden">
        <div className="flex flex-col justify-center items-center text-white">
          <p className="font-light text-lg">#1 RATED SOFTWARE</p>
          <p className="text-xl font-semibold ">Join millions of happy users </p>
        </div>
        <motion.div
          className="flex"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`, transition: "transform 0.5s ease-in-out" }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="h-[500px] flex-shrink-0 p-4" style={{ width: `${100 / itemsPerView}%` }}>
              <div className="bg-white h-full p-6 rounded-2xl flex flex-col items-center justify-center gap-5 shadow-md text-center">
                <div>
                  <img src={t.profile} className="rounded-full w-44 h-44 object-cover object-top" width={500} height={500}/>
                </div>
                <p className="text-lg font-semibold text-[#6257E2]">{t.name}</p>
                <div className="flex justify-center gap-6 mt-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="relative">
                      {/* <FaStar className="text-gray-300" /> */}
                      {t.rating >= i + 1 ? (
                        <FaStar className="text-orange-400 absolute" />
                      ) : t.rating > i ? (
                        <FaStarHalfAlt className="text-orange-400 absolute" />
                      ) : null}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{t.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      {canScroll && (
        <div className="flex mt-4 space-x-2">
          {[...Array(testimonials.length - (itemsPerView - 1))].map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-400"}`}
              onMouseEnter={stopAutoScroll}
              onMouseLeave={startAutoScroll}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;