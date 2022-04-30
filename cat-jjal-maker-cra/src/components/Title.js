const Title = ({ counter, title }) => {
    const mainTitle = counter === 1 ? title : counter + "번째 " + title;
    return (
        <h1>{mainTitle}</h1>
    );
};

export default Title;