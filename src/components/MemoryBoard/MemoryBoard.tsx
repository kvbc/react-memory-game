import { useState, useEffect } from "react"
import Cell, { ICell } from "./Cell"
import Row from "./Row"
import styled from "styled-components"
import constants from "./constants"
import { assert } from "chai"
import { HiCursorClick } from "react-icons/hi"
import { BiTimeFive } from "react-icons/bi"

interface IProps {
    width: number
    height: number
    className?: string
}

function MemoryBoard ({ width, height, className }: IProps) {
    const [canClickCells, setCanClickCells] = useState<boolean>(true)
    const [clickedCells, setClickedCells] = useState<[ICell | null, ICell | null]>([null, null])
    const [cells, setCells] = useState<Array<Array<ICell>>>([])
    const [clickCount, setClickCount] = useState<number>(0)
    const [secondsPassed, setSecondsPassed] = useState<number>(0)
    const [hasGameEnded, setHasGameEnded] = useState<boolean>(false)

    useEffect(() => {
        if (hasGameEnded === true) // just clear the interval in the destructor
            return
        const intervalID = setInterval(() => {
            setSecondsPassed(currentSecondsPassed => currentSecondsPassed + 1)
        }, 1000)
        return () => {
            clearInterval(intervalID)
        }
    }, [hasGameEnded])
    
    useEffect(() => {
        setHasGameEnded(
            cells.every(row =>
                row.every(cell => 
                    cell.isRevealed === true
                )
            )
        )
    }, [cells])

    useEffect(() => {
        assert((width * height) % 2 === 0, "the size of the board should be even")
        reset()
    }, [width, height])

    useEffect(() => {
        const cell_1 = clickedCells[0]
        const cell_2 = clickedCells[1]

        if (cell_1 === null)
            return
        if (cell_2 === null)
            return

        let timeoutID: number | null = null

        if (cell_1.content === cell_2.content) {
            setClickedCells([null, null])
        }
        else if (cell_1.content !== cell_2.content) {
            setCanClickCells(false)
            timeoutID = setTimeout(() => {
                cell_1.isRevealed = false
                cell_2.isRevealed = false
                setCells([...cells])
                setCanClickCells(true)
                setClickedCells([null, null])
            }, 1000)
        }

        return () => {
            if (timeoutID !== null)
                clearTimeout(timeoutID)
        }
    }, [clickedCells])

    /*
     *
     *
     * 
     */

    function reset () {
        setCanClickCells(true)
        setClickedCells([null, null])
        setClickCount(0)
        setSecondsPassed(0)

        let newCells: Array<Array<ICell>> = Array(height)
            .fill([])
            .map(row => 
                Array(width).fill(null)
            )
        
        function shuffledArray<T> (array: Array<T>): Array<T> {
            return array // shuffle the array
                .map(x => ({ x, rand: Math.random() }))
                .sort((a, b) => a.rand - b.rand)
                .map(({ x }) => x)
        } 

        let emojis: Array<string> = ['🍇', '🍈', '🍉',  '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐',  '🍑',  '🍒',  '🍓',  '🥝',   '🍅',  '🥥',  '🥑',  '🍆',  '🥔',  '🥕',  '🌽',   '🌶️',  '🥒',  '🥬',  '🥦',  '🧄',  '🧅',  '🍄',  '🥜',  '🌰',  '🍞',  '🥐',  '🥖',   '🥨',  '🥯',  '🥞',  '🧇',  '🧀',   '🍖',    '🍗',   '🥩',    '🥓',  '🍔',  '🍟',   '🍕',  '🌭',   '🥪',  '🌮',  '🌯',  '🥙',   '🧆',  '🥚',  '🍳',  '🥘',     '🍲',    '🥣',    '🥗', '🍿',  '🧈',  '🧂',  '🥫',   '🍱',   '🍘',   '🍙',   '🍚',   '🍛',   '🍜',   '🍝',  '🍠',    '🍢',  '🍣',  '🍤',   '🍥',     '🥮',   '🍡',  '🥟',  '🥠',   '🥡',   '🦪',  '🍦',   '🍧',   '🍨',  '🍩', '🍪', '🎂',  '🍰', '🧁', '🥧', '🍫',  '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺',  '🍻',   '🥂',  '🥃',  '🥤',   '🧃',  '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄']
        let availableIndices: Array<[number, number]> = []
        newCells.forEach((row, y) =>
            row.forEach((cell, x) => 
                availableIndices.push([x, y])
            )
        )
        emojis = shuffledArray(emojis)
        availableIndices = shuffledArray(availableIndices)

        for (;;) {
            const emoji = emojis.pop()
            const indices_1 = availableIndices.pop()
            const indices_2 = availableIndices.pop()
            if (
                (emoji === undefined) ||
                (indices_1 === undefined) ||
                (indices_2 === undefined)
            )
                break
            for (let indices of [indices_1, indices_2]) {
                const ix = indices[0]
                const iy = indices[1]
                newCells[iy][ix] = {
                    isRevealed: false,
                    content: emoji
                }
            }
        }

        setCells(newCells)
    }

    function getTimePassedString (): string {
        if (secondsPassed < 60)
            return `${secondsPassed}s`
        return `${Math.floor(secondsPassed / 60)}m ${secondsPassed % 60}s`
    }

    /*
     *
     * Handlers
     * 
     */

    function handleTryAgainButtonClick () {
        reset()
    }

    function handleCellClick (event: React.MouseEvent, cell: ICell): void {
        if (!canClickCells)
            return
        setClickCount(clickCount + 1)
        cell.isRevealed = true
        setCells([...cells])
        if (clickedCells[0] === null)
            setClickedCells([ cell, null ])
        else
            setClickedCells([ clickedCells[0], cell ])
    }

    /*
     *
     * Render
     * 
     */

    return <div className={className}>
        <StyledTop>
            <BiTimeFive />
            {getTimePassedString()}
            <HiCursorClick />
            {clickCount}
        </StyledTop>
        <StyledRowContainer>
            {cells.map((row, y) =>
                <Row key={y}>
                    {row.map((cell, x) => 
                        <Cell
                            key = {x}
                            cell = {cell}
                            onClick = {handleCellClick}
                        />
                    )}
                </Row>
            )}
        </StyledRowContainer>
        {hasGameEnded && <StyledBottom>
            You did it!
            <button onClick={handleTryAgainButtonClick}>Try again</button>
        </StyledBottom>}
    </div>
}

/*
 *
 * Styles
 * 
 */

const StyledMemoryBoard = styled(MemoryBoard)`
    width: min-content;
    border-radius: 25px;
    border: 3px solid gray;
    box-shadow: 0 0 15px lightgray;
    padding: 15px;
`

const StyledTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px 15px 0;
    gap: 10px;

    font-size: 1.5rem;
    svg {
        font-size: 2rem;
    }
`

const StyledBottom = styled.div`
    margin-top: 15px;
    gap: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
        width: 100%;
        border: transparent;
        padding: 10px;
        color: white;
        border-radius: 15px;
        font-size: 1.5rem;
        background-color: deepskyblue;
        cursor: pointer;
    }
`

const StyledRowContainer = styled.div`
    display: flex;
    width: fit-content;
    flex-direction: column;
    gap: ${constants.gap}
`

export default StyledMemoryBoard