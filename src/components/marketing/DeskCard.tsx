import React, { useState } from "react"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import ProductInput from "./ProductInput"
import "./marketing.css"

type Props = {
  id?: number
  initialItems?: string[]
    onRemove?: () => void
    certified?: boolean
    onCertify?: (validator?: string) => void
    validatorsList?: string[]
    approvedValidators?: string[]
    activeValidator?: string | null
}

function DeskCard({ id = 1, initialItems = [""], onRemove, certified = false, onCertify, validatorsList = [], approvedValidators = [], activeValidator }: Props){
    const [editing, setEditing] = useState(false)
    const [items, setItems] = useState<string[]>(initialItems)
    const [dirty, setDirty] = useState(false)
    const [showCertModal, setShowCertModal] = useState(false)

    function setItem(index: number, value: string){
        const next = [...items]
        next[index] = value
        setItems(next)
        setDirty(true)
    }

    function addItem(){
        setItems(prev => [...prev, ""])
        setDirty(true)
    }

    function removeItem(index: number){
        setItems(prev => prev.filter((_, i) => i !== index))
        setDirty(true)
    }

    function handleOpenCert(){
        setShowCertModal(true)
    }

    async function handleConfirmCert(){
        // perform save here (dummy) before certifying
        if (dirty){
            console.log("Saving card before certify", id, items)
            await new Promise(resolve => setTimeout(resolve, 200))
            setDirty(false)
        }

        // irreversible action: notify parent to add this validator as approved
        const validatorToAdd = activeValidator || undefined
        onCertify && onCertify(validatorToAdd)
        setShowCertModal(false)
        setEditing(false)
        console.log("Card certified", id)
    }

    function handleCancelCert(){
        setShowCertModal(false)
    }

    return (
        <Card className="mp-desk-card">
            <CardHeader className="mp-card-header">
                <div>Desk Card #{id}</div>
                <div className="mp-header-actions">
                  <button
                      className="mp-remove-icon"
                      onClick={() => onRemove && onRemove()}
                      title="Remove card"
                      aria-label={`Remove card ${id}`}
                      disabled={certified}
                  >
                      🗑️
                  </button>
                  {!certified && (
                    <button
                        className={`mp-edit-btn ${editing ? "active" : ""}`}
                        onClick={() => setEditing(v => !v)}
                        aria-pressed={editing}
                        title={editing ? "Stop editing" : "Edit card"}
                    >
                        ✏️
                    </button>
                  )}
                </div>
            </CardHeader>
            <CardBody>
                <div className={`mp-inputs ${editing ? "" : "mp-disabled"}`}>
                    {items.map((val, idx) => (
                        <div key={idx} className="mp-input-row">
                            <ProductInput
                                value={val}
                                onChange={v => setItem(idx, v)}
                                disabled={!editing}
                                placeholder={`Product ${idx + 1}`}
                            />
                            {editing && (
                                <button className="mp-remove-btn" onClick={() => removeItem(idx)}>-</button>
                            )}
                        </div>
                    ))}
                    {editing && (
                        <div className="mp-actions">
                            <button className="mp-add-btn" onClick={addItem}>+ Add Input</button>
                        </div>
                    )}
                </div>
            </CardBody>
            <CardFooter className={`mp-card-footer ${certified ? "mp-certified" : ""}`}>
                <div className="mp-footer-left">
                    {(() => {
                        const approved = approvedValidators || []
                        const total = (validatorsList || []).length
                        const approvedCount = approved.length

                        if (total > 0 && approvedCount >= total) {
                            return <div className="mp-certified-badge">✅ Certified</div>
                        }

                        // Determine next required validator for this card
                        const nextValidator = validatorsList[approvedCount]

                        // If all approved, show overall Certified
                        if (approvedCount >= total && total > 0) {
                            return <div className="mp-certified-badge">✅ Certified</div>
                        }

                        // If active validator is exactly the next required approver, show Certify button
                        if (activeValidator && nextValidator === activeValidator) {
                            return (
                                <button
                                    className="mp-certify-btn"
                                    onClick={() => {
                                        setShowCertModal(true)
                                    }}
                                    title={dirty ? "Save and then certify" : "Certify"}
                                >
                                    Certify
                                </button>
                            )
                        }

                        // If the active validator already approved, show their chip
                        if (activeValidator && approved.includes(activeValidator)) {
                            return <span className={`mp-approval-chip mp-approval-chip-me`}>✅ {activeValidator}</span>
                        }

                        // Otherwise hide the control (not their turn)
                        return null
                    })()}
                </div>
                <div className="mp-footer-right">Footer Information</div>
            </CardFooter>

            {showCertModal && (
                <div className="mp-modal-overlay" role="dialog" aria-modal="true">
                    <div className="mp-modal">
                        <h3>Confirm Certification</h3>
                        <p>This action is irreversible. Are you sure you want to certify this card?</p>
                        <div className="mp-modal-actions">
                            <button className="mp-modal-cancel" onClick={handleCancelCert}>Cancel</button>
                            <button className="mp-modal-confirm" onClick={handleConfirmCert}>Yes, Certify</button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default DeskCard