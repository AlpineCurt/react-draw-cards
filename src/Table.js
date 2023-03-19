import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";
import {v4 as uuid} from "uuid";

const Table = () => {
    const [deckId, setDeckId] = useState();
    const [cards, setCards] = useState([]);
    const [cardsRemaining, setCardsRemaining] = useState(true);
    const [drawing, setDrawing] = useState(false);
    const timerId = useRef(null);

    // Get new deckId when first rendered
    useEffect(() => {
        async function getDeckId() {
            const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            setDeckId(res.data.deck_id);
        }
        getDeckId();
    }, []);

    // Auto draw if drawing is true
    useEffect(() => {
        if (drawing && !timerId.current) {
            timerId.current = setInterval(async () => {
                await drawCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        }
    }, [drawing]);

    // Part 1 - Draw single card
    const drawCard = async () => {
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            setCards((cards) => [...cards, {key: uuid(), img: res.data.cards[0].image}]);
            if (res.data.remaining === 0) {
                setCardsRemaining(false);
                throw new Error("No cards remaining!");
            }
        } catch (err) {
            alert(err);
        }
    }

    // Part 2 - toggle auto drawing
    const toggleDraw = async () => {
        setDrawing(!drawing);
    }

    return (
        <div>
            {/* {cardsRemaining ? <button onClick={drawCard}>Gimmie a Card!</button> : null} */}
            {drawing
                ? <button onClick={toggleDraw}>Stop Drawing</button>
                : <button onClick={toggleDraw}>Start Drawing</button>}
            <div className="Table">
                {cards.map(({key, img}) => <Card key={key} src={img}/>)}
            </div>
        </div>
    )
}

export default Table;