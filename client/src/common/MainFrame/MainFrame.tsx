import * as React from "react";

interface PropsMainFrame {
    header: string;
    tools?: React.ReactNode;
}

/**
 * Компонент, который реализует основной шаблон страницы
 * @param props 
 * @param {string} props.header Заголовок страницы
 * @param props.children Логическое содержимое страницы
 */
export const MainFrame: React.FC<PropsMainFrame> = (props) => (
    <div className="main-frame">
        <header>
            <h1>{props.header}</h1>
            {props.tools}
        </header>
        <article>
            {props.children}
        </article>
        <footer></footer>
    </div>
);
