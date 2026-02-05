import React, { useState, useEffect } from "react"
import DeskCard from "./DeskCard"
import "./marketing.css"
import cardsData from "./marketing-cards.json"

type CardModel = {
  id: number
  items: string[]
  certified?: boolean
}

function LandingPage(){
    const [cards, setCards] = useState<CardModel[]>([])
    const [showCertAllModal, setShowCertAllModal] = useState(false)

    useEffect(() => {
        // Load from local JSON file in the marketing folder (imported above)
        const seeded = (cardsData as CardModel[]).map(c => ({ ...c, certified: false }))
        setCards(seeded)
    }, [])

    function openCertAll(){
        setShowCertAllModal(true)
    }

    function cancelCertAll(){
        setShowCertAllModal(false)
    }

    function confirmCertAll(){
        setCards(prev => prev.map(c => ({ ...c, certified: true })))
        setShowCertAllModal(false)
    }

    function addCard(){
        setCards(prev => [...prev, { id: prev.length + 1, items: [""] }])
    }

    function removeCard(id: number){
        setCards(prev => prev.filter(c => c.id !== id))
    }

    return (
        <div className="mp-landing">
            <div className="mp-landing-actions">
                <button onClick={addCard} className="mp-add-card">+ Add Card</button>
                <button onClick={openCertAll} className="mp-certify-all">Save & Certify All</button>
            </div>
            <div className="mp-cards-grid">
                {cards.map(card => (
                    <div key={card.id} className="mp-card-wrap">
                        <DeskCard
                            id={card.id}
                            initialItems={card.items}
                            certified={card.certified}
                            onCertify={() => setCards(prev => prev.map(p => p.id === card.id ? { ...p, certified: true } : p))}
                            onRemove={() => removeCard(card.id)}
                        />
                    </div>
                ))}
            </div>
            {showCertAllModal && (
                <div className="mp-modal-overlay" role="dialog" aria-modal="true">
                    <div className="mp-modal">
                        <h3>Confirm Certify All</h3>
                        <p>This action will certify ALL cards. This is irreversible. Continue?</p>
                        <div className="mp-modal-actions">
                            <button className="mp-modal-cancel" onClick={cancelCertAll}>Cancel</button>
                            <button className="mp-modal-confirm" onClick={confirmCertAll}>Yes, Certify All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Certify All modal
{
    /* modal is rendered inline below */
}

export default LandingPage
