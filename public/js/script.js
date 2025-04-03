// Efecto de interacción con el cursor
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--primary', 
        `hsl(${200 + x * 20}, 100%, 50%)`);
    
    document.documentElement.style.setProperty('--secondary', 
        `hsl(${330 + y * 20}, 100%, 40%)`);
});