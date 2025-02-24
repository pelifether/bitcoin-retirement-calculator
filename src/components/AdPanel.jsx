function AdPanel() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white rounded-lg p-6 shadow-lg mt-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-bold mb-2">
          Quer ganhar convicção sobre o Bitcoin?
        </h3>
        
        <p className="text-blue-200 mb-4">
          A Paradigma tem os melhores cursos, relatórios, carteiras e comunidade de cripto do Brasil.
        </p>
        
        <div className="flex justify-center space-x-2 items-center text-sm text-blue-200">
          <span>✓ Aulas curtas</span>
          <span>•</span>
          <span>✓ Professores mão-na-massa</span>
          <span>•</span>
          <span>✓ Comunidade antenada</span>
        </div>

        <a 
          href="https://paradigma.education/pro" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-4 px-6 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 hover:shadow-lg"
        >
          Conheça a Paradigma PRO →
        </a>
      </div>
    </div>
  );
}

export default AdPanel; 