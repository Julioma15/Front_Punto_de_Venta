import { Stack } from 'expo-router';

const SlideNavbar_Layout = ()=>{
    return (
        <Stack
            screenOptions={{
                headerShown: false //Que no muestre otro menu. Unicamente aparece el del index.jsx
            }}    

        />

    )
}

export default SlideNavbar_Layout