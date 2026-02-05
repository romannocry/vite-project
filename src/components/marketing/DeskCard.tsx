import React, { useState } from "react"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import ProductInput from "./ProductInput"
import "./marketing.css"

type Props = {
  id?: number
  initialItems?: string[]
    onRemove?: () => void
    certified?: boolean
    onCertify?: () => void
}

function DeskCard({ id = 1, initialItems = [""], onRemove, certified = false, onCertify }: Props){
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

    function handleSave(): Promise<void>{
        // Dummy save function — replace with real API call later
        console.log("Saving card", id, items)
        return new Promise(resolve => {
            setTimeout(() => {
                setDirty(false)
                resolve()
            }, 200)
        })
    }

    function handleOpenCert(){
        setShowCertModal(true)
    }

    function handleConfirmCert(){
        // irreversible action: notify parent to mark certified and lock edits
        onCertify && onCertify()
        setShowCertModal(false)
        setDirty(false)
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
                    {certified ? (
                        <div className="mp-certified-badge">✅ Certified</div>
                    ) : (
                        <button
                            className="mp-certify-btn"
                            onClick={async () => {
                                if (certified) return
                                if (dirty) await handleSave()
                                setShowCertModal(true)
                            }}
                            disabled={certified}
                            title={certified ? "Already certified" : dirty ? "Save and then certify" : "Certify"}
                        >
                            Save & Certify
                        </button>
                    )}
                </div>
                <div className="mp-footer-right">xx</div>
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