import React, { useState, useEffect } from "react"
import DeskCard from "./DeskCard"
import "./marketing.css"
import cardsData from "./marketing-cards.json"
import validatorsData from "./validators.json"

type CardModel = {
  id: number
  items: string[]
  validators?: string[]
  certified?: boolean
}

function LandingPage(){
    const [cards, setCards] = useState<CardModel[]>([])
    const [showCertAllModal, setShowCertAllModal] = useState(false)
    const [activeValidator, setActiveValidator] = useState<string | null>(null)

    // typed validators data
    const typedValidators = validatorsData as { id: number; validators: string[] }[]

    // build validators map by id for quick lookup
    const validatorsMap = React.useMemo(() => {
        const m = new Map<number, string[]>()
        typedValidators.forEach((v) => m.set(v.id, v.validators))
        return m
    }, [typedValidators])

    const allValidators = React.useMemo(() => {
        const s = new Set<string>()
        typedValidators.forEach(v => v.validators.forEach(x => s.add(x)))
        return Array.from(s)
    }, [typedValidators])

    useEffect(() => {
        // Load from local JSON file in the marketing folder (imported above)
        const seeded = (cardsData as CardModel[]).map(c => ({ ...c, certified: false, validators: c.validators || [] }))
        setCards(seeded)
        // pick a sensible default active validator
        if (allValidators.length > 0) setActiveValidator(allValidators[0])
    }, [])

    function openCertAll(){
        setShowCertAllModal(true)
    }

    function cancelCertAll(){
        setShowCertAllModal(false)
    }

    function confirmCertAll(){
        if (!activeValidator) return setShowCertAllModal(false)
        setCards(prev => prev.map(c => {
            const validatorsList = validatorsMap.get(c.id) || []
            const approved = c.validators || []
            const next = validatorsList[approved.length]
            if (next === activeValidator) {
                const nextApproved = [...approved, activeValidator]
                const isCertified = nextApproved.length >= validatorsList.length
                return { ...c, validators: nextApproved, certified: isCertified }
            }
            return c
        }))
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
            <div>
                <label style={{ marginRight: 8 }}>Active validator:</label>
                <select value={activeValidator ?? ""} onChange={e => setActiveValidator(e.target.value)}>
                    <option value="">-- select validator --</option>
                    {allValidators.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>

            <div className="mp-cards-grid">
                {cards
                    .filter(card => {
                        if (!activeValidator) return true
                        const list = validatorsMap.get(card.id) || []
                        return list.includes(activeValidator)
                    })
                    .map(card => (
                        <div key={card.id} className="mp-card-wrap">
                            <DeskCard
                                id={card.id}
                                initialItems={card.items}
                                certified={card.certified}
                                // pass approved validators array
                                approvedValidators={card.validators || []}
                                // pass global validators list for this card
                                validatorsList={validatorsMap.get(card.id) || []}
                                activeValidator={activeValidator}
                                onCertify={(validator?: string) => {
                                    if (!validator) return
                                    setCards(prev => prev.map(p => p.id === card.id ? { ...p, validators: [...(p.validators || []), validator], certified: ((p.validators || []).length + 1) >= ((validatorsMap.get(card.id) || []).length) } : p))
                                }}
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
