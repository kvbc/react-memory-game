import styled from "styled-components"

export interface ICell {
    isRevealed: boolean
    content: string
}

interface IProps {
    cell: ICell
    onClick: (event: React.MouseEvent, cell: ICell) => void
    className?: string
}

function Cell ({ cell, className, onClick }: IProps) {
    function handleCellClick (event: React.MouseEvent) {
        if (cell.isRevealed)
            return
        onClick(event, cell)
    }

    return <div onClick={handleCellClick}>
        <div className={className + " inner"}>
            <div className={className + " front"} >
                {cell.content}
            </div>
            <div className={className + " back"} />
        </div>
    </div>
}

/*
 *
 * Styles
 * 
 */

const StyledCell = styled(Cell)`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    
    ${props => !props.cell.isRevealed && `
        cursor: pointer;
    `}

    &.inner {
        transform-style: preserve-3d;
        position: relative;
        transition: transform 0.5s;
        ${props => !props.cell.isRevealed && `
            transform: rotateY(180deg);
        `}
    }

    &.front, &.back {
        position: absolute;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
    }

    &.front {
        background-color: rgb(238, 238, 238); // #eee
    }
    
    &.back {
        background-color: rgb(230, 230, 230); // #ddd > x > #eee
        transform: rotateY(180deg);
    }
`

export default StyledCell