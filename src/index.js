import '~/styles/test.styles.scss';
import '~/styles/test.fonts.scss';

window.onload = () => {
  // root-нода
  const formNode = document.querySelector('#input-form');
  let isResultShown = false;

  formNode.onsubmit = (e) => {
    e.preventDefault();

    if (!isResultShown) {
      showResult(
        e.currentTarget,
        calculateData(getFormData(e.currentTarget), 2),
        getFormData(e.currentTarget),
        resultTemplate
      );

      isResultShown = true;
    } else {
      showForm(formNode, formTemplate);
      isResultShown = false;
    }
  };

  const formTemplate = document.querySelector('template[id="form-template"]');
  const resultTemplate = document.querySelector('template[id="result-template"]');

  // Старт приложения
  showForm(formNode, formTemplate);
};

const getFormData = (formNode) => {
  const formData = new FormData(formNode);

  return Object.fromEntries(formData);
};

const calculateData = (data, fractionDigits) => {
  const { poisson, durability, deformation, radius, mass } = data;

  const soilExpansionCoefficient = (poisson / (1 - poisson)).toFixed(fractionDigits);

  const cutterContactForce = (4 * deformation * Math.sqrt(radius)
    / (3 * (1 - Math.pow(poisson, 2)))).toFixed(fractionDigits);

  const approachSpeed = (Math.pow(2 * 3.14 * radius * durability /
    (3 * soilExpansionCoefficient * Math.pow(cutterContactForce, 0.8)
    * Math.pow((1.25 * mass), 0.2)), 2.5)).toFixed(fractionDigits);


  return { soilExpansionCoefficient, cutterContactForce, approachSpeed };
};

const deleteForm = (formNode) => {
  formNode.innerHTML = '';
};

const showForm = (formNode, formTemplate) => {
  deleteForm(formNode);

  const formTemplateClone = formTemplate.content.cloneNode(true);

  formNode.append(formTemplateClone);
};

const showResult = (formNode, resultData, formData, resultTemplate) => {
  const { soilExpansionCoefficient, cutterContactForce, approachSpeed } = resultData;
  const { poisson, durability, deformation, radius, mass } = formData;

  deleteForm(formNode);

  const resultTemplateClone = resultTemplate.content.cloneNode(true);

  resultTemplateClone.querySelector('span[id="soil-expansion-coefficient"]').innerText = soilExpansionCoefficient;
  resultTemplateClone.querySelector('span[id="cutter-contact-force"]').innerText = cutterContactForce;
  resultTemplateClone.querySelector('span[id="approach-speed"]').innerText = `${approachSpeed}, м/с`;

  resultTemplateClone.querySelector('span[id="deformation"]').innerText = deformation;
  resultTemplateClone.querySelector('span[id="durability"]').innerText = durability;
  resultTemplateClone.querySelector('span[id="poisson"]').innerText = poisson;
  resultTemplateClone.querySelector('span[id="radius"]').innerText = radius;
  resultTemplateClone.querySelector('span[id="mass"]').innerText = mass;

  formNode.append(resultTemplateClone);
};
