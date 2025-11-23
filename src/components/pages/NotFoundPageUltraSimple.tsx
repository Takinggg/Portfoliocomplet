/**
 * NotFoundPageUltraSimple - Version minimale garantie sans crash
 */

export default function NotFoundPageUltraSimple() {
  const goHome = () => {
    window.location.href = '/fr';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0C0C0C',
      color: '#F4F4F4',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '120px', 
          margin: '0 0 20px 0',
          color: '#CCFF00',
          fontWeight: 900 
        }}>
          404
        </h1>
        
        <h2 style={{ 
          fontSize: '32px', 
          margin: '0 0 20px 0',
          fontWeight: 700 
        }}>
          Page non trouvÃ©e
        </h2>
        
        <p style={{ 
          fontSize: '18px', 
          margin: '0 0 40px 0',
          color: 'rgba(244, 244, 244, 0.7)' 
        }}>
          La page que vous recherchez n'existe pas.
        </p>
        
        <button
          onClick={goHome}
          style={{
            background: '#CCFF00',
            color: '#0C0C0C',
            border: 'none',
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ðŸ  Retour Ã  l'accueil
        </button>
        
        <div style={{ 
          marginTop: '40px',
          fontSize: '12px',
          color: 'rgba(244, 244, 244, 0.4)'
        }}>
          <p>URL: {window.location.pathname}</p>
        </div>
      </div>
    </div>
  );
}
