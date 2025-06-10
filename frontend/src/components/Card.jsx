import React from "react";
import { FaWhatsapp, FaInstagram, FaShareAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const Card = ({ business, loading = false }) => {
  if (!business && !loading) {
    console.warn("Card component received null/undefined business");
    return null; // ou retorne um card vazio/placeholder
  }

  const cleanPhoneNumber = (whatsapp) => whatsapp.replace(/\D/g, "");

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold">
            <Skeleton width={180} />
          </h3>
          <p className="text-xs text-gray-400 uppercase">
            <Skeleton width={120} />
          </p>
        </div>
        <Skeleton height={192} className="w-full" />
        <div className="p-4">
          <Skeleton count={2} />
        </div>
        <div className="p-4 flex justify-between items-center border-t">
          <Skeleton width={80} height={20} />
          <div className="flex space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} circle width={24} height={24} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function sanitizeHtmlContent(html) {
    return html.replace(/<p>(&nbsp;|\s)*<\/p>/g, "").trim();
  }

  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  const sanitized = sanitizeHtmlContent(business.description);
  const plainText = stripHtml(sanitized);
  const preview =
    plainText.length > 100 ? plainText.slice(0, 50) + "..." : plainText;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{business.name}</h3>
        <p className="text-[10px] text-gray-400 uppercase">
          {business.address?.neighborhood?.name}, {business.address?.city?.name}
        </p>
      </div>

      {business.photos?.[0] && (
        <Link to={`/business/${business.slug}`}>
          <div className="relative group overflow-hidden">
            <img
              alt={business.name}
              src={business.photos[0].replace(
                "/upload/",
                "/upload/f_webp/q_auto/"
              )}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105 rounded-b-2xl"
            />
            {/* Tag da categoria */}
            <div className="absolute top-2 left-2 bg-blue-400 text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
              {business.category?.name || "Categoria"}
            </div>
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
      )}

      <div className="p-4 text-sm text-gray-600">
        <p className="prose">{preview}</p>
      </div>

      <div className="p-4 flex justify-between items-center border-t">
        <Link
          to={`/business/${business.slug}`}
          className="uppercase font-semibold text-xs text-[#042f4a] "
        >
          Ver mais
        </Link>

        <div className="flex items-center space-x-3">
          {business.whatsapp && (
            <a
              href={`https://api.whatsapp.com/send/?phone=55${cleanPhoneNumber(
                business.whatsapp
              )}&text=Encontrei+sua+empresa+no+Guia+Do+Vale&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-green-500 text-xl hover:text-green-600 transition-colors" />
            </a>
          )}

          {business.social?.instagram && (
            <a
              href={`https://instagram.com/${business.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-pink-500 text-xl hover:text-pink-600 transition-colors" />
            </a>
          )}

          <FavoriteButton businessId={business._id} />

          <button aria-label="Compartilhar">
            <FaShareAlt className="text-gray-500 text-xl hover:text-gray-700 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
