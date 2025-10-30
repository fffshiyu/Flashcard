/* global React, ReactDOM */
const { useState, useMemo } = React;

function App() {
  const cards = useMemo(() => {
    return [
      {
        id: 0,
        front: 'Flashcard 1',
        back: 'A collaborative browser-based interface design tool',
      },
      {
        id: 1,
        front: 'Flashcard 2',
        back: 'React is a JavaScript library for building user interfaces',
      },
      {
        id: 2,
        front: 'Flashcard 3',
        back: 'CSS Grid is a two-dimensional layout system for the web',
      },
      {
        id: 3,
        front: 'Flashcard 4',
        back: 'APIs allow different software systems to communicate',
      },
      {
        id: 4,
        front: 'Flashcard 5',
        back: 'JavaScript enables interactive web experiences',
      },
      {
        id: 5,
        front: 'Flashcard 6',
        back: 'HTML structures content on the web',
      },
      {
        id: 6,
        front: 'Flashcard 7',
        back: 'CSS styles and layouts web pages',
      },
      {
        id: 7,
        front: 'Flashcard 8',
        back: 'Git manages code versions and collaboration',
      },
      {
        id: 8,
        front: 'Flashcard 9',
        back: 'Responsive design adapts to different screen sizes',
      },
      {
        id: 9,
        front: 'Flashcard 10',
        back: 'TypeScript adds static typing to JavaScript',
      },
      {
        id: 10,
        front: 'Flashcard 11',
        back: 'Node.js runs JavaScript on the server side',
      },
      {
        id: 11,
        front: 'Flashcard 12',
        back: 'REST APIs enable communication between systems',
      },
      {
        id: 12,
        front: 'Flashcard 13',
        back: 'GraphQL provides efficient data querying',
      },
      {
        id: 13,
        front: 'Flashcard 14',
        back: 'Docker containerizes applications for deployment',
      },
      {
        id: 14,
        front: 'Flashcard 15',
        back: 'Kubernetes orchestrates containerized applications',
      },
      {
        id: 15,
        front: 'Flashcard 16',
        back: 'MongoDB is a NoSQL document database',
      },
      {
        id: 16,
        front: 'Flashcard 17',
        back: 'PostgreSQL is a powerful relational database',
      },
      {
        id: 17,
        front: 'Flashcard 18',
        back: 'Redis provides fast in-memory data storage',
      },
      {
        id: 18,
        front: 'Flashcard 19',
        back: 'Webpack bundles JavaScript modules efficiently',
      },
      {
        id: 19,
        front: 'Flashcard 20',
        back: 'CI/CD automates testing and deployment',
      },
    ];
  }, []);

  const [flipped, setFlipped] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [remembered, setRemembered] = useState(new Set());
  const [forgotten, setForgotten] = useState(new Set());
  const [removing, setRemoving] = useState(null);
  const [shakingKey, setShakingKey] = useState(0);
  const [cardPosition, setCardPosition] = useState(null);

  const toggleCard = (id) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openCard = (id, event) => {
    const cardElement = event.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    
    setCardPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });
    
    setSelectedId(id);
    // 立即翻转到背面
    setFlipped((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const closeCard = () => {
    setSelectedId(null);
  };

  const markRemembered = (id) => {
    // 标记为正在移除
    setRemoving(id);
    
    // 延迟关闭弹窗
    setTimeout(() => {
      setRemembered((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setForgotten((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      closeCard();
      setRemoving(null);
      
      // 触发摇晃动画（通过改变 key）
      setShakingKey(prev => prev + 1);
    }, 300);
  };

  const markForgotten = (id) => {
    setForgotten((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setRemembered((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setTimeout(() => closeCard(), 300);
  };

  const selectedCard = selectedId !== null ? cards.find(c => c.id === selectedId) : null;

  return (
    <>
      <div className="page">
        <div className="grid">
          {cards.filter(c => !remembered.has(c.id)).map((c) => (
            <div
              key={`${c.id}-${shakingKey}`}
              className={`card${selectedId === c.id ? ' hidden' : ''}`}
              onClick={(e) => openCard(c.id, e)}
            >
              <div className="cardInner">
                <div className="cardFace front">
                  <img src="Star outline (1).png" alt="star" className="starIcon" />
                  <div className="cardTitle">{c.front}</div>
                </div>
                <div className="cardFace back">
                  <img src="Star outline.png" alt="star" className="starIcon" />
                  <div className="cardContent">{c.back}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && cardPosition && (
        <div className="overlay" onClick={closeCard}>
          <div
            className={`zoomCard${flipped.has(selectedCard.id) ? ' flipped' : ''}${removing === selectedCard.id ? ' removing' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              '--start-top': `${cardPosition.top}px`,
              '--start-left': `${cardPosition.left}px`,
              '--start-width': `${cardPosition.width}px`,
              '--start-height': `${cardPosition.height}px`
            }}
          >
            <div className="cardInner">
              <div className="cardFace front">
                <img src="Star outline (1).png" alt="star" className="starIcon" />
                <div className="cardTitle">{selectedCard.front}</div>
              </div>
              <div className="cardFace back">
                <img src="Star outline.png" alt="star" className="starIcon" />
                <div className="cardContent">{selectedCard.back}</div>
              </div>
            </div>
            <div className="actionButtons">
              <button 
                className="actionBtn cross" 
                onClick={(e) => {
                  e.stopPropagation();
                  markForgotten(selectedCard.id);
                }}
                aria-label="没记住"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="6" y1="6" x2="18" y2="18"/>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                </svg>
              </button>
              <button 
                className="actionBtn check" 
                onClick={(e) => {
                  e.stopPropagation();
                  markRemembered(selectedCard.id);
                }}
                aria-label="记住了"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);





