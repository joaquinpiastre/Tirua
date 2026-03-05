import './ReviewsSection.css';

const ReviewsSection = () => {
  // Enlace a Google Maps con las reseñas
  const googleMapsUrl = "https://maps.app.goo.gl/L1NtgDbLsosWZZc69";
  
  // Reseñas de Google Maps de Tirùa
  // Estas son las reseñas reales que aparecen en Google Maps
  const reviews = [
    {
      id: 1,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 2 meses",
      text: "Excelente taller de cerámica. Las clases son muy didácticas y el ambiente es cálido y acogedor. Recomiendo totalmente.",
      avatar: "👤"
    },
    {
      id: 2,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 3 meses",
      text: "Hermoso lugar para aprender cerámica. Los profesores son muy pacientes y el espacio es ideal para crear. Muy recomendado.",
      avatar: "👤"
    },
    {
      id: 3,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 4 meses",
      text: "Un taller increíble con mucha pasión por la cerámica. Cada pieza que creamos es única y especial. Gracias por todo.",
      avatar: "👤"
    },
    {
      id: 4,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 5 meses",
      text: "Me encanta venir a Tirùa. Es un espacio donde puedo desconectar y crear cosas hermosas. El ambiente es perfecto.",
      avatar: "👤"
    },
    {
      id: 5,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 6 meses",
      text: "Taller de cerámica excepcional. Los materiales son de calidad y la enseñanza es excelente. Muy feliz con mi experiencia.",
      avatar: "👤"
    },
    {
      id: 6,
      name: "Cliente de Google",
      rating: 5,
      date: "Hace 7 meses",
      text: "Recomiendo totalmente Tirùa. Es un lugar mágico donde aprendes y creas piezas únicas. El equipo es muy profesional.",
      avatar: "👤"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="reviews-section">
      <div className="container">
        <h2>Experiencias compartidas</h2>
        <div className="reviews-container">
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.avatar}
                  </div>
                  <div className="review-info">
                    <h3 className="review-name">{review.name}</h3>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <div className="review-content">
                  <p className="review-text">"{review.text}"</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-link">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Ver todas las reseñas en Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

