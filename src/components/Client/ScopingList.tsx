import { useState, useEffect, useMemo, useRef, useCallback} from "react";
import { ClientItem, SelectivityItem} from './types'
import { dataset, initialSelectivity, loggedIn} from './data'

function ScopingList() {
    const [data, setData] = useState<ClientItem[]>([]);
    const [selectivityData, setSelectivityData] = useState<SelectivityItem[]>([]);
    const [textFilter, setTextFilter] = useState<string>('');
    const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);
    const [modalInfo, setModalInfo] = useState<null | { id: string; action: "add" | "update status" }>(null);
    const [comment, setComment] = useState("");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        setData(dataset);
        setSelectivityData(initialSelectivity);
    }, []);

    const uniqueNames = Array.from(new Set(selectivityData.map(s => s.name)));

    const selectivityMap = selectivityData.reduce((acc, item) => {
        if (!acc[item.id]) acc[item.id] = new Set();
        acc[item.id].add(item.name);
        return acc;
    }, {} as Record<string, Set<string>>);

    // Filter data
    let filteredData = data.filter(item => {
        const matchesText = item.name.toLowerCase().includes(textFilter.toLowerCase());
        const isMine = selectivityMap[item.id]?.has(loggedIn);
        return matchesText && (!showOnlyMine || isMine);
    });

    // Sort data by client name
    if (sortDirection) {
        filteredData = filteredData.slice().sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return sortDirection === 'asc' ? -1 : 1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const toggleSort = () => {
        if (sortDirection === null) setSortDirection('asc');
        else if (sortDirection === 'asc') setSortDirection('desc');
        else setSortDirection(null);
    };

    const openModal = (id: string, action: "add" | "update status") => {
        setModalInfo({ id, action });
        setComment("");
    };

    const handleSubmit = async () => {
        if (!modalInfo) return;

        // Dummy API call
        await postSelectionChange({
            id: modalInfo.id,
            action: modalInfo.action,
            user: loggedIn,
            comment,
        });

        if (modalInfo.action === "add") {
            setSelectivityData(prev => [...prev, { id: modalInfo.id, name: loggedIn }]);
        } else {
            setSelectivityData(prev => prev.filter(s => !(s.id === modalInfo.id && s.name === loggedIn)));
        }

        setModalInfo(null);
    };

    const postSelectionChange = async (payload: {
        id: string;
        action: "add" | "update status";
        user: string;
        comment: string;
    }) => {
        console.log("Sending to API:", payload);
        return new Promise((resolve) => setTimeout(resolve, 500));
    };

    return (
        <>
            <h2>Client List for {loggedIn}</h2>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Filter by client name"
                    value={textFilter}
                    onChange={(e) => setTextFilter(e.target.value)}
                    style={{ marginRight: '10px', padding: '4px' }}
                />

                <label style={{ fontSize: '14px' }}>
                    <input
                        type="checkbox"
                        checked={showOnlyMine}
                        onChange={(e) => setShowOnlyMine(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    Show only my clients
                </label>
            </div>

            <table border={1} cellPadding={5}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={toggleSort}
                        >
                            Client Name {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : ''}
                        </th>
                        <th>Action</th>
                        {uniqueNames.map(name => (
                            <th key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => {
                        const isSelected = selectivityMap[item.id]?.has(loggedIn);
                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>
                                    <button onClick={() => openModal(item.id, isSelected ? "update status" : "add")}>
                                        {isSelected ? "update status" : "Add"}
                                    </button>
                                </td>
                                {uniqueNames.map(name => (
                                    <td key={name}>
                                        {selectivityMap[item.id]?.has(name) ? 'x' : ''}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {modalInfo && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <h3>{modalInfo.action === 'add' ? 'Add Client' : 'update status'}</h3>
                        <textarea
                            placeholder="Enter a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setModalInfo(null)}>Cancel</button>
                            <button onClick={handleSubmit}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ScopingList;