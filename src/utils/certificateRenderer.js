// Cache for loaded images
const imageCache = new Map();

export async function loadImage(src) {
  if (!src) return null;
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => {
      console.warn('Failed to load image:', src, e);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Main certificate render engine for MEDHA Certificate of Participation
 */
export async function renderCertificateToCanvas(canvas, participant, config) {
  if (!canvas || !participant) return;

  const ctx = canvas.getContext('2d');
  
  // High resolution 16:9 canvas matching participation.png
  const width = config.width || 1920;
  const height = config.height || 1080;

  canvas.width = width;
  canvas.height = height;

  const defaultBg = `${import.meta.env.BASE_URL}templates/participation.png`;
  const bgSource = config.backgroundImage || defaultBg;
  const bgImg = await loadImage(bgSource);

  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  const scale = width / 1200;

  // -------------------------------------------------------------------------
  // 1. Student Full Name (Centered on Line 1: Mr./Ms. ______________)
  // -------------------------------------------------------------------------
  const nameY = (height * (config.nameY ?? 46.4)) / 100;
  const nameX = (width * (config.nameX ?? 52.6)) / 100;
  const nameSize = (config.nameSize ?? 34) * scale;

  ctx.textAlign = config.nameAlign || 'center';
  ctx.font = `${config.nameWeight ?? '700'} ${nameSize}px '${config.nameFont ?? 'Outfit'}', 'Montserrat', sans-serif`;
  ctx.fillStyle = config.nameColor ?? '#002b5b';

  const cleanName = participant.fullName || 'Student Name';
  ctx.fillText(cleanName, nameX, nameY);

  // -------------------------------------------------------------------------
  // 2. College / Department / Team (Centered on Line 2: of ________________)
  // -------------------------------------------------------------------------
  const collegeY = (height * (config.collegeY ?? 53.4)) / 100;
  const collegeX = (width * (config.collegeX ?? 50.8)) / 100;
  const collegeSize = (config.collegeSize ?? 24) * scale;

  ctx.textAlign = config.collegeAlign || 'center';
  ctx.font = `${config.collegeWeight ?? '600'} ${collegeSize}px '${config.collegeFont ?? 'Outfit'}', 'Montserrat', sans-serif`;
  ctx.fillStyle = config.collegeColor ?? '#002b5b';

  let collegeText = participant.collegeName || 'Godavari Global University';
  if (config.includeTeamInCollege && participant.teamName) {
    collegeText = `${collegeText} (Team: ${participant.teamName})`;
  }

  ctx.fillText(collegeText, collegeX, collegeY);
}
