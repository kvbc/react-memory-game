import MemoryBoard from "./components/MemoryBoard/MemoryBoard"
import styled from "styled-components"

interface IProps {
    className?: string
}

function App ({ className }: IProps) {
    return <div className={className}>
        <MemoryBoard width={6} height={5} />
    </div>
}

/*
 *
 * Styles
 * 
 */

const StyledApp = styled(App)`
    display: flex;
    justify-content: center;
    font-family: Helvetica;
`

export default StyledApp