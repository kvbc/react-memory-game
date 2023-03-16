import styled from "styled-components"
import constants from "./constants"

interface IProps {
    children: React.ReactNode
    className?: string
}

function Row ({ children, className }: IProps) {
    return <div className={className}>
        {children}
    </div>
}

/*
 *
 * Styles
 * 
 */

const StyledRow = styled(Row)`
    display: flex;
    width: min-content;
    gap: ${constants.gap}
`

export default StyledRow