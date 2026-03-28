import React, { useState, useRef } from 'react';
import { RotateCcw, TrendingUp, ExternalLink } from 'lucide-react';

// ============================================
// 📚 DOCUMENTATION RAPIDE
// ============================================
// Structure des infos:
// - what: De quoi parle l'info?
// - who: Qui dit cela / qui est concerné?
// - when: Quand? (date/époque)
// - where: Où? (lieu/endroit)
// - why: Pourquoi? (contexte/raison)
// - isTrue: true/false
// - source: "nom.fr" (affiché dans la carte)
// - sourceUrl: "https://..." (lien cliquable vers vérification)
// - image: URL d'une image (optionnel - laisse vide "" si pas d'image)
// - truth: Explication/correction de l'info si elle est fausse
// ============================================

// ============================================
// 🔗 SOURCES FIABLES (À MODIFIER AVEC TES COLLÈGUES)
// ============================================
// Modifiez cette liste ensemble pour définir quels médias/sites sont fiables
// Les élèves doivent vérifier si la source est dans cette liste!
const SOURCES_FIABLES = [
  "info.gouv.fr",
  "gouvernement.fr",
  "economie.gouv.fr",
  "anses.fr",
  "franceinfo.fr",
  "francetv.fr",
  "france2.fr",
  "france3.fr",
  "lemonde.fr",
  "lefigaro.fr",
  "bfmtv.com",
  "europe1.fr",
  "radiofrance.fr",
  "senat.fr",
  "assemblee-nationale.fr",
  "has-sante.fr",
  "sante.gouv.fr",
  "education.gouv.fr"
];

// ============================================
// 📌 VRAIES INFOS (sources fiables 2026)
// ============================================
const VRAIES_INFOS = [
  {
    what: "Revalorisation du SMIC de 1,18%",
    who: "Gouvernement français",
    when: "1er janvier 2026",
    where: "France métropolitaine et DOM-TOM",
    why: "Combinaison de l'inflation et de l'évolution des salaires",
    isTrue: true,
    source: "Info.gouv.fr",
    sourceUrl: "https://www.info.gouv.fr",
    image: "https://images.unsplash.com/photo-1579621970563-430f63602022?w=400&h=300&fit=crop",
    truth: "Le SMIC mensuel brut passe à 1 823,03 euros"
  },
  {
    what: "Changement d'heure d'été",
    who: "Union Européenne",
    when: "Dimanche 29 mars 2026 à 2h du matin",
    where: "France et Europe",
    why: "Mesure européenne en vigueur depuis 1976",
    isTrue: true,
    source: "Info.gouv.fr",
    sourceUrl: "https://www.info.gouv.fr",
    image: "https://images.unsplash.com/photo-1533070487551-74f7ee97757d?w=400&h=300&fit=crop",
    truth: "Il faut ajouter 60 minutes (2h devient 3h)"
  },
  {
    what: "Taxe sur les petits colis importés",
    who: "Gouvernement français",
    when: "1er mars 2026",
    where: "France (petits colis importés)",
    why: "Lutter contre la concurrence des plateformes e-commerce",
    isTrue: true,
    source: "Économie.gouv.fr",
    sourceUrl: "https://www.economie.gouv.fr",
    image: "https://images.unsplash.com/photo-1578932750294-708761ef30c0?w=400&h=300&fit=crop",
    truth: "2 euros par article pour les colis importés"
  },
  {
    what: "Alerte sanitaire sur le cadmium dans les engrais",
    who: "Anses (Agence nationale de sécurité sanitaire)",
    when: "Mars 2026",
    where: "France",
    why: "Métal toxique présent dans les sols et aliments",
    isTrue: true,
    source: "Anses.fr",
    sourceUrl: "https://www.anses.fr",
    image: "https://images.unsplash.com/photo-1530587191325-3db8b08ef14d?w=400&h=300&fit=crop",
    truth: "L'État intervient pour diminuer les teneurs en cadmium des engrais phosphatés"
  },
  {
    what: "Hausse des frais de scolarité pour étudiants étrangers",
    who: "Gouvernement français",
    when: "2026",
    where: "France (Universités)",
    why: "Mesure de restriction budgétaire en enseignement supérieur",
    isTrue: true,
    source: "France Info",
    sourceUrl: "https://www.franceinfo.fr",
    image: "https://images.unsplash.com/photo-1427504494785-cddc0c575e6b?w=400&h=300&fit=crop",
    truth: "Augmentation confirmée des droits pour les non-citoyens UE"
  }
];

// ============================================
// 🎯 FAUSSES INFOS (À COMPLÉTER - PLACEHOLDERS)
// ============================================
// 👉 MODIFIE CES PLACEHOLDERS AVEC TES PROPRES FAUSSES INFOS!
// 
// EXEMPLE COMPLET:
// {
//   what: "Le baccalauréat est supprimé en 2026",
//   who: "Gouvernement français",
//   when: "2026",
//   where: "France",
//   why: "Harmonisation européenne",
//   isTrue: false,
//   source: "À remplir",
//   sourceUrl: "https://...", // Optionnel
//   image: "https://images.unsplash.com/photo-??", // Optionnel
//   truth: "Le baccalauréat reste le diplôme officiel de fin d'études"
// }
//
const FAUSSES_INFOS = [
  {
    what: "PLACEHOLDER 1 - À COMPLÉTER",
    who: "??",
    when: "??",
    where: "??",
    why: "??",
    isTrue: false,
    source: "À remplir",
    sourceUrl: "",
    image: "",
    truth: "À remplir - explication de pourquoi c'est faux"
  },
  {
    what: "PLACEHOLDER 2 - À COMPLÉTER",
    who: "??",
    when: "??",
    where: "??",
    why: "??",
    isTrue: false,
    source: "À remplir",
    sourceUrl: "",
    image: "",
    truth: "À remplir - explication de pourquoi c'est faux"
  },
  {
    what: "PLACEHOLDER 3 - À COMPLÉTER",
    who: "??",
    when: "??",
    where: "??",
    why: "??",
    isTrue: false,
    source: "À remplir",
    sourceUrl: "",
    image: "",
    truth: "À remplir - explication de pourquoi c'est faux"
  },
  {
    what: "PLACEHOLDER 4 - À COMPLÉTER",
    who: "??",
    when: "??",
    where: "??",
    why: "??",
    isTrue: false,
    source: "À remplir",
    sourceUrl: "",
    image: "",
    truth: "À remplir - explication de pourquoi c'est faux"
  },
  {
    what: "PLACEHOLDER 5 - À COMPLÉTER",
    who: "??",
    when: "??",
    where: "??",
    why: "??",
    isTrue: false,
    source: "À remplir",
    sourceUrl: "",
    image: "",
    truth: "À remplir - explication de pourquoi c'est faux"
  }
];

const EMIGame = () => {
  const [gameState, setGameState] = useState('start');
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);

  // Générer les questions selon la difficulté
  const generateQuestions = (diff) => {
    let selected = [];

    if (diff === 'facile') {
      selected = [...VRAIES_INFOS.slice(0, 3), ...FAUSSES_INFOS.slice(0, 2)];
    } else if (diff === 'moyen') {
      selected = [...VRAIES_INFOS.slice(0, 4), ...FAUSSES_INFOS.slice(1, 2)];
    } else if (diff === 'difficile') {
      selected = [VRAIES_INFOS[0], VRAIES_INFOS[2], VRAIES_INFOS[4], FAUSSES_INFOS[1], FAUSSES_INFOS[3]];
    }

    const shuffled = selected.sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
    }
  };

  const startGame = (diff) => {
    setDifficulty(diff);
    setGameState('playing');
    setScore(0);
    generateQuestions(diff);
  };

  const handleSwipe = (e) => {
    if (!currentQuestion || feedback) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY; // Positif = vers le haut, négatif = vers le bas
    
    if (Math.abs(diff) > 60) {
      const isSwipeUp = diff > 0; // Vers le haut = VRAI
      const userAnswer = isSwipeUp; // true = VRAI, false = FAUX
      const isCorrect = userAnswer === currentQuestion.isTrue;
      
      setSwipeDirection(isSwipeUp ? 'up' : 'down');
      setFeedback({
        isCorrect,
        message: isCorrect ? '✓ Bien vu!' : '✗ Incorrect!',
        truth: currentQuestion.truth,
        source: currentQuestion.source
      });
      
      if (isCorrect) setScore(score + 1);
      
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
          setCurrentQuestion(questions[currentIndex + 1]);
          setFeedback(null);
          setSwipeDirection(null);
        } else {
          setGameState('result');
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Décoration animée */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* ÉCRAN D'ACCUEIL */}
      {gameState === 'start' && (
        <div className="relative z-10 text-center">
          <div className="mb-8 animate-bounce">
            <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
              EMI QUEST
            </div>
          </div>
          <p className="text-white text-2xl mb-12 font-light">Détecte les infos vraies et fausses! 🔍</p>
          
          <div className="space-y-4 max-w-md mx-auto">
            {[
              { name: '⭐ FACILE', value: 'facile', desc: 'Pour commencer' },
              { name: '🔥 MOYEN', value: 'moyen', desc: 'Plus de nuance' },
              { name: '💀 DIFFICILE', value: 'difficile', desc: 'Expert en EMI' }
            ].map(level => (
              <button
                key={level.value}
                onClick={() => startGame(level.value)}
                className="w-full py-4 px-6 bg-white text-purple-600 font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all active:scale-95"
              >
                {level.name}
                <div className="text-xs opacity-60 mt-1">{level.desc}</div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-white text-sm opacity-75 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm max-w-md mx-auto">
            <p className="mb-2">⬆️ <strong>Swipe vers le HAUT</strong> = VRAI ✅</p>
            <p>⬇️ <strong>Swipe vers le BAS</strong> = FAUX ❌</p>
          </div>
        </div>
      )}

      {/* ÉCRAN JEU */}
      {gameState === 'playing' && currentQuestion && (
        <div className="relative z-10 w-full max-w-2xl">
          {/* Score bar */}
          <div className="mb-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 flex items-center justify-between text-white font-bold">
            <span>Question {currentIndex + 1}/5</span>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              <span className="text-xl">{score}</span>
            </div>
          </div>

          {/* Carte swipeable */}
          <div
            ref={cardRef}
            onTouchStart={e => setTouchStartY(e.changedTouches[0].clientY)}
            onTouchEnd={handleSwipe}
            className={`bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing transform transition-all duration-300 ${
              swipeDirection === 'up' ? '-translate-y-96 -rotate-12 opacity-0' : ''
            } ${
              swipeDirection === 'down' ? 'translate-y-96 rotate-12 opacity-0' : ''
            } ${
              feedback?.isCorrect ? 'ring-4 ring-green-400' : feedback?.isCorrect === false ? 'ring-4 ring-red-400' : ''
            }`}
            style={{
              minHeight: '680px',
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="text-white h-full flex flex-col">
              {/* Image si elle existe */}
              {currentQuestion.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={currentQuestion.image} 
                    alt="Info illustration"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900"></div>
                </div>
              )}

              {/* Contenu */}
              <div className="p-8 flex flex-col justify-between flex-1">
                {/* Les 5 W */}
                <div className="space-y-4">
                  <div className="text-xs opacity-75 font-bold tracking-widest">📰 INFORMATION À VÉRIFIER</div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: '❓', label: 'QUOI', value: currentQuestion.what },
                      { icon: '👤', label: 'QUI', value: currentQuestion.who },
                      { icon: '📅', label: 'QUAND', value: currentQuestion.when },
                      { icon: '📍', label: 'OÙ', value: currentQuestion.where },
                      { icon: '🎯', label: 'POURQUOI', value: currentQuestion.why }
                    ].map((w, i) => (
                      <div key={i} className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm border border-white border-opacity-30">
                        <div className="text-xs opacity-80 font-bold mb-1">{w.icon} {w.label}</div>
                        <div className="text-sm font-semibold leading-tight">{w.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Source avec lien cliquable */}
                  <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                    <div className="text-xs opacity-75 font-bold mb-2">🔗 SOURCE</div>
                    {currentQuestion.sourceUrl ? (
                      <a 
                        href={currentQuestion.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-yellow-200 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {currentQuestion.source}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <div className="text-sm font-semibold text-yellow-200">{currentQuestion.source}</div>
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm backdrop-blur-sm border border-white border-opacity-30 ${
                    feedback.isCorrect
                      ? 'bg-green-500 bg-opacity-30 text-green-100'
                      : 'bg-red-500 bg-opacity-30 text-red-100'
                  }`}>
                    <div className="text-base mb-2">{feedback.message}</div>
                    <div className="opacity-85 leading-snug text-xs">{feedback.truth}</div>
                    {feedback.source && (
                      <div className="text-xs opacity-70 mt-2">Source: {feedback.source}</div>
                    )}
                  </div>
                )}

                {!feedback && (
                  <div className="mt-6 text-center text-sm opacity-75 animate-pulse">
                    ⬆️ Swipe haut ou bas ⬇️
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Indicateurs swipe */}
          <div className="mt-8 text-center space-y-4 px-4">
            <div className="text-white font-bold text-2xl">⬆️</div>
            <div className="text-white font-bold text-lg">✅ VRAI</div>
            <div className="text-white text-xs opacity-60">—</div>
            <div className="text-white font-bold text-lg">❌ FAUX</div>
            <div className="text-white font-bold text-2xl">⬇️</div>
          </div>
        </div>
      )}

      {/* ÉCRAN RÉSULTAT */}
      {gameState === 'result' && (
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className={`text-8xl font-black mb-4 ${
              score >= 4 ? 'animate-bounce' : ''
            }`}>
              {score >= 4 ? '🎉' : score >= 3 ? '😊' : '📚'}
            </div>
            <div className={`text-7xl font-black bg-clip-text text-transparent mb-4 ${
              score >= 4
                ? 'bg-gradient-to-r from-yellow-200 to-yellow-500'
                : 'bg-gradient-to-r from-white to-gray-300'
            }`}>
              {score}/5
            </div>
          </div>

          <p className="text-white text-2xl mb-6 font-light max-w-md mx-auto">
            {score >= 4 && 'Excellent! Tu es un expert en EMI! 🔥'}
            {score === 3 && 'Bien joué! Continue à vérifier! 📖'}
            {score === 2 && 'Pas mal! Travaille l\'esprit critique! 🧠'}
            {score <= 1 && 'Fake news partout! À revoir! 📱'}
          </p>

          <div className="bg-white bg-opacity-10 rounded-2xl p-6 mb-8 max-w-md mx-auto text-white text-sm backdrop-blur-sm">
            <p className="font-bold mb-2">💡 Conseil EMI:</p>
            <p className="opacity-75">Cherche toujours sur les sources officielles: Figaro, France Info, Gouvernement (info.gouv.fr), etc.</p>
          </div>

          <button
            onClick={() => setGameState('start')}
            className="flex items-center gap-3 mx-auto px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all active:scale-95"
          >
            <RotateCcw size={24} />
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

export default EMIGame;
