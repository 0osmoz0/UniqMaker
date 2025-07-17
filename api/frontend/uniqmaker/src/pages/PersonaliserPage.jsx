import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(101, 119, 234, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(101, 119, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(101, 119, 234, 0); }
`;

// Composants stylisés
const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  color: #2d3748;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  span {
    color: #718096;
    font-size: 16px;
    font-weight: 500;
  }
`;

const StepBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 380px;
  gap: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  height: ${props => props.fullHeight ? '100%' : 'fit-content'};
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.03);
`;

const PanelTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #667eea;
  }
`;

const PrintZoneContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
`;

const PrintZoneItem = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
  padding: 12px;
  background: ${props => props.active ? '#f8fafc' : 'white'};
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: ${props => props.active ? '0 4px 12px rgba(101, 119, 234, 0.1)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const PrintZoneLabel = styled.div`
  text-align: center;
  font-size: 13px;
  margin-top: 12px;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
`;

const ToolButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: ${props => props.active ? '#ebf4ff' : '#f8fafc'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
  gap: 8px;
  border: 1px solid ${props => props.active ? 'rgba(101, 119, 234, 0.2)' : 'rgba(0, 0, 0, 0.03)'};
  
  &:hover {
    background: #ebf4ff;
    color: #667eea;
  }
  
  svg {
    font-size: 20px;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 10px;
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(101, 119, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(101, 119, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmojiButton = styled.button`
  font-size: 24px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: scale(1.1);
    background: #ebf4ff;
  }
`;

const Dropzone = styled.div`
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin-bottom: 16px;
  transition: all 0.2s;
  background: #f8fafc;
  
  &:hover {
    border-color: #667eea;
    background: #ebf4ff;
  }
  
  input {
    display: none;
  }
  
  label {
    display: block;
    cursor: pointer;
  }
`;

const ShapePreview = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  div {
    background: ${props => props.color};
    opacity: ${props => props.opacity};
  }
  
  .rectangle {
    width: 40px;
    height: 30px;
  }
  
  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  
  .triangle {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 30px solid ${props => props.color};
    background: transparent;
  }
  
  .line {
    width: 40px;
    height: 2px;
  }
`;

const API_BASE = 'http://localhost:5001';

function PrintZone({ position, isActive, onClick }) {
  const containerRef = useRef(null);
  const [imgSizes, setImgSizes] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  if (!position.points || position.points.length < 2) return null;

  const p1 = position.points[0];
  const p2 = position.points[1];

  const onImageLoad = (e) => {
    setImgSizes({
      naturalWidth: e.target.naturalWidth,
      naturalHeight: e.target.naturalHeight,
      clientWidth: e.target.clientWidth,
      clientHeight: e.target.clientHeight,
    });
  };

  const scaleX = imgSizes.clientWidth && imgSizes.naturalWidth
    ? imgSizes.clientWidth / imgSizes.naturalWidth
    : 1;
  const scaleY = imgSizes.clientHeight && imgSizes.naturalHeight
    ? imgSizes.clientHeight / imgSizes.naturalHeight
    : 1;

  const left = Math.min(p1.distance_from_left, p2.distance_from_left) * scaleX;
  const top = Math.min(p1.distance_from_top, p2.distance_from_top) * scaleY;
  const width = Math.abs(p2.distance_from_left - p1.distance_from_left) * scaleX;
  const height = Math.abs(p2.distance_from_top - p1.distance_from_top) * scaleY;

  const zoneStyle = {
    position: 'absolute',
    left,
    top,
    width,
    height,
    border: isActive ? '2px solid #667eea' : '1px dashed #a0aec0',
    backgroundColor: isActive ? 'rgba(101, 119, 234, 0.05)' : 'rgba(160, 174, 192, 0.02)',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };

  return (
    <PrintZoneItem 
      active={isActive}
      onClick={onClick}
      ref={containerRef}
    >
      <img
        src={position.images?.[0]?.print_position_image_with_area}
        alt={position.position_id}
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block', 
          borderRadius: 8,
          aspectRatio: '1/1',
          objectFit: 'cover'
        }}
        onLoad={onImageLoad}
      />
      {imgSizes.naturalWidth > 0 && (
        <div style={zoneStyle} />
      )}
      <PrintZoneLabel active={isActive}>
        {position.position_name || `Zone ${position.position_id}`}
      </PrintZoneLabel>
    </PrintZoneItem>
  );
}

function DesignEditor({ activePosition, onAddElement, onUpdateElement, designElements }) {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#4a5568');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [activeTool, setActiveTool] = useState('text');
  const [alignment, setAlignment] = useState('center');
  const [textDecoration, setTextDecoration] = useState('none');
  const [opacity, setOpacity] = useState(100);
  const fileInputRef = useRef(null);

  const handleAddText = () => {
    if (text.trim() && activePosition) {
      const newText = {
        id: `text-${Date.now()}`,
        type: 'text',
        content: text,
        color,
        font,
        fontSize: parseInt(fontSize),
        x: 10,
        y: 10,
        width: 100,
        height: 30,
        positionId: activePosition.position_id,
        alignment,
        textDecoration,
        opacity: opacity / 100
      };
      onAddElement(newText);
      setText('');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const baseWidth = 100;
          
          const newImage = {
            id: `img-${Date.now()}`,
            type: 'image',
            src: event.target.result,
            x: 10,
            y: 10,
            width: baseWidth,
            height: baseWidth / aspectRatio,
            positionId: activePosition?.position_id,
            opacity: opacity / 100
          };
          onAddElement(newImage);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddShape = (shape) => {
    if (activePosition) {
      const newShape = {
        id: `shape-${Date.now()}`,
        type: 'shape',
        shape,
        color,
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        positionId: activePosition.position_id,
        opacity: opacity / 100
      };
      onAddElement(newShape);
    }
  };

  const handleAddEmoji = (emoji) => {
    if (activePosition) {
      onAddElement({
        id: `emoji-${Date.now()}`,
        type: 'text',
        content: emoji,
        color: color,
        font: 'Arial',
        fontSize: 24,
        x: 10,
        y: 10,
        width: 30,
        height: 30,
        positionId: activePosition.position_id,
        opacity: opacity / 100
      });
    }
  };

  const handleDeleteSelected = () => {
    const selectedElements = designElements.filter(el => el.selected);
    if (selectedElements.length > 0) {
      const newElements = designElements.filter(el => !el.selected);
      onUpdateElement(newElements);
    }
  };

  const handleReset = () => {
    if (activePosition) {
      const newElements = designElements.filter(el => el.positionId !== activePosition.position_id);
      onUpdateElement(newElements);
    }
  };

  return (
    <Panel fullHeight>
      <PanelTitle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Outils de personnalisation
      </PanelTitle>
      
      {activePosition && (
        <div style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ebf4ff 100%)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(101, 119, 234, 0.1)'
        }}>
          <h4 style={{ 
            color: '#4a5568',
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {activePosition.position_name || `Zone ${activePosition.position_id}`}
          </h4>
          <p style={{ 
            fontSize: '13px', 
            color: '#718096',
            margin: 0
          }}>
            Taille max: {activePosition.max_print_size_width}mm × {activePosition.max_print_size_height}mm
          </p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <ToolButton
          active={activeTool === 'text'}
          onClick={() => setActiveTool('text')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 7H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Texte
        </ToolButton>
        <ToolButton
          active={activeTool === 'image'}
          onClick={() => setActiveTool('image')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46972 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Image
        </ToolButton>
        <ToolButton
          active={activeTool === 'shape'}
          onClick={() => setActiveTool('shape')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="15.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="15.5" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="15.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Forme
        </ToolButton>
      </div>

      {activeTool === 'text' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#4a5568'
            }}>Ajouter du texte</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez votre texte ici..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s',
                outline: 'none',
                fontFamily: font
              }}
            />
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Couleur du texte</label>
              <ColorPicker
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Police</label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Taille du texte</label>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568'
              }}>{fontSize}px</span>
            </div>
            <Slider
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <ToolButton
              active={alignment === 'left'}
              onClick={() => setAlignment('left')}
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gauche
            </ToolButton>
            <ToolButton
              active={alignment === 'center'}
              onClick={() => setAlignment('center')}
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Centre
            </ToolButton>
            <ToolButton
              active={alignment === 'right'}
              onClick={() => setAlignment('right')}
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Droite
            </ToolButton>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <ToolButton
              active={textDecoration === 'underline'}
              onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4V11C6 13.2091 7.79086 15 10 15H14C16.2091 15 18 13.2091 18 11V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 21H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Souligné
            </ToolButton>
            <ToolButton
              active={textDecoration === 'italic'}
              onClick={() => setTextDecoration(textDecoration === 'italic' ? 'none' : 'italic')}
              style={{ padding: '10px', fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 20H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Italique
            </ToolButton>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Opacité</label>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568'
              }}>{opacity}%</span>
            </div>
            <Slider
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
            />
          </div>

          <PrimaryButton 
            onClick={handleAddText}
            disabled={!text.trim()}
            style={{
              opacity: !text.trim() ? 0.6 : 1,
              cursor: !text.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ajouter le texte
          </PrimaryButton>
        </div>
      )}

      {activeTool === 'image' && (
        <div style={{ marginBottom: '24px' }}>
          <Dropzone>
            <input
              type="file"
              id="image-upload"
              ref={fileInputRef}
              multiple
              onChange={handleImageUpload}
              accept="image/*"
            />
            <label htmlFor="image-upload">
              <div style={{ 
                fontSize: '40px', 
                color: '#667eea',
                marginBottom: '12px'
              }}>📁</div>
              <div style={{ fontWeight: '600', color: '#4a5568' }}>Glissez-déposez vos images</div>
              <div style={{ 
                fontSize: '13px', 
                marginTop: '8px',
                color: '#718096'
              }}>Formats supportés: JPG, PNG, SVG</div>
              <div style={{ 
                marginTop: '16px',
                padding: '10px 16px',
                backgroundColor: '#ebf4ff',
                borderRadius: '8px',
                display: 'inline-block',
                color: '#667eea',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                Parcourir les fichiers
              </div>
            </label>
          </Dropzone>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Opacité</label>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568'
              }}>{opacity}%</span>
            </div>
            <Slider
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#4a5568'
            }}>Images récentes</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {[
                'https://via.placeholder.com/100',
                'https://via.placeholder.com/100/ff0000',
                'https://via.placeholder.com/100/00ff00',
                'https://via.placeholder.com/100/0000ff'
              ].map((img, i) => (
                <div 
                  key={i}
                  style={{
                    aspectRatio: '1/1',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => {
                    const newImage = {
                      id: `img-${Date.now()}`,
                      type: 'image',
                      src: img,
                      x: 10,
                      y: 10,
                      width: 100,
                      height: 100,
                      positionId: activePosition?.position_id,
                      opacity: opacity / 100
                    };
                    onAddElement(newImage);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTool === 'shape' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#4a5568'
            }}>Couleur de la forme</label>
            <ColorPicker
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              fontSize: '14px',
              color: '#4a5568'
            }}>Type de forme</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}>
              {['rectangle', 'circle', 'triangle', 'line'].map((shape) => (
                <ToolButton
                  key={shape}
                  onClick={() => handleAddShape(shape)}
                  style={{ padding: '12px' }}
                >
                  <ShapePreview color={color} opacity={opacity/100}>
                    <div className={shape} />
                  </ShapePreview>
                  {shape === 'rectangle' && 'Rectangle'}
                  {shape === 'circle' && 'Cercle'}
                  {shape === 'triangle' && 'Triangle'}
                  {shape === 'line' && 'Ligne'}
                </ToolButton>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '13px',
                color: '#718096',
                fontWeight: '500'
              }}>Opacité</label>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568'
              }}>{opacity}%</span>
            </div>
            <Slider
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600', 
          fontSize: '14px',
          color: '#4a5568'
        }}>Emojis populaires</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px'
        }}>
          {['❤️', '⭐', '🎯', '🌈', '✨', '🦋', '🌿', '⚡', '🎨', '🖤', '👍', '🔥'].map((emoji, i) => (
            <EmojiButton
              key={i}
              onClick={() => handleAddEmoji(emoji)}
            >
              {emoji}
            </EmojiButton>
          ))}
        </div>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <ToolButton 
          onClick={handleDeleteSelected}
          style={{
            backgroundColor: designElements.some(el => el.selected) ? '#fff5f5' : '#f8fafc',
            color: designElements.some(el => el.selected) ? '#f56565' : '#a0aec0',
            flex: 1,
            fontWeight: '600'
          }}
          disabled={!designElements.some(el => el.selected)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Supprimer
        </ToolButton>
        <ToolButton 
          onClick={handleReset}
          style={{
            flex: 1,
            fontWeight: '600'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87914 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Réinitialiser
        </ToolButton>
      </div>

      <PrimaryButton style={{
        backgroundColor: '#4fd1c5',
        background: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Ajouter au panier - 29,99€
      </PrimaryButton>
    </Panel>
  );
}

function ProductPreview({ product, activePosition, designElements, onUpdateElement }) {
  const containerRef = useRef(null);
  const [imgSizes, setImgSizes] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  if (!activePosition || !activePosition.points || activePosition.points.length < 2) {
    return (
      <Panel style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '600px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ebf4ff 100%)'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            opacity: 0.6
          }}>👕</div>
          <h4 style={{ 
            color: '#4a5568',
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Aucune zone sélectionnée
          </h4>
          <p style={{ 
            fontSize: '14px', 
            color: '#718096',
            margin: 0
          }}>
            Sélectionnez une zone de personnalisation pour commencer
          </p>
        </div>
      </Panel>
    );
  }

  const p1 = activePosition.points[0];
  const p2 = activePosition.points[1];

  const onImageLoad = (e) => {
    setImgSizes({
      naturalWidth: e.target.naturalWidth,
      naturalHeight: e.target.naturalHeight,
      clientWidth: e.target.clientWidth,
      clientHeight: e.target.clientHeight,
    });
  };

  const scaleX = imgSizes.clientWidth && imgSizes.naturalWidth
    ? imgSizes.clientWidth / imgSizes.naturalWidth
    : 1;
  const scaleY = imgSizes.clientHeight && imgSizes.naturalHeight
    ? imgSizes.clientHeight / imgSizes.naturalHeight
    : 1;

  const left = Math.min(p1.distance_from_left, p2.distance_from_left) * scaleX;
  const top = Math.min(p1.distance_from_top, p2.distance_from_top) * scaleY;
  const width = Math.abs(p2.distance_from_left - p1.distance_from_left) * scaleX;
  const height = Math.abs(p2.distance_from_top - p1.distance_from_top) * scaleY;

  const zoneStyle = {
    position: 'absolute',
    left,
    top,
    width,
    height,
    border: '2px dashed #667eea',
    backgroundColor: 'rgba(101, 119, 234, 0.05)',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };

  const currentElements = designElements.filter(el => el.positionId === activePosition.position_id);

  const handleDragStop = (element, e, data) => {
    // Calcul des nouvelles positions en pourcentage par rapport à la zone
    const newX = Math.max(0, Math.min(width - (element.width / 100 * width), data.x)) / width * 100;
    const newY = Math.max(0, Math.min(height - (element.height / 100 * height), data.y)) / height * 100;
    
    const updatedElements = designElements.map(el => 
      el.id === element.id ? { ...el, x: newX, y: newY } : el
    );
    
    onUpdateElement(updatedElements);
  };

  const handleResizeStop = (element, direction, ref, delta, position) => {
    // Calcul des nouvelles dimensions et positions en pourcentage
    const newWidth = Math.min(width, parseInt(ref.style.width)) / width * 100;
    const newHeight = Math.min(height, parseInt(ref.style.height)) / height * 100;
    const newX = Math.max(0, Math.min(width - parseInt(ref.style.width), position.x)) / width * 100;
    const newY = Math.max(0, Math.min(height - parseInt(ref.style.height), position.y)) / height * 100;
    
    const updatedElements = designElements.map(el => 
      el.id === element.id ? { 
        ...el, 
        width: newWidth, 
        height: newHeight, 
        x: newX, 
        y: newY 
      } : el
    );
    
    onUpdateElement(updatedElements);
  };

  const handleSelectElement = (elementId) => {
    const updatedElements = designElements.map(el => ({
      ...el,
      selected: el.id === elementId
    }));
    
    onUpdateElement(updatedElements);
  };

  return (
    <Panel>
      <PanelTitle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Aperçu du design
      </PanelTitle>
      
      <div style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%',
        margin: '20px auto',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <img
          src={activePosition.images?.[0]?.print_position_image_with_area || product.main_image}
          alt={activePosition.position_id}
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            display: 'block',
            backgroundColor: '#f8fafc'
          }}
          onLoad={onImageLoad}
        />
        {imgSizes.naturalWidth > 0 && (
          <div style={zoneStyle}>
            {currentElements.map((element) => {
              const elementWidth = (element.width / 100) * width;
              const elementHeight = (element.height / 100) * height;
              const elementX = (element.x / 100) * width;
              const elementY = (element.y / 100) * height;

              return (
                <Rnd
                  key={element.id}
                  bounds="parent"
                  size={{ width: elementWidth, height: elementHeight }}
                  position={{ x: elementX, y: elementY }}
                  onDragStop={(e, data) => handleDragStop(element, e, data)}
                  onResizeStop={(e, direction, ref, delta, position) => 
                    handleResizeStop(element, direction, ref, delta, position)
                  }
                  onMouseDown={() => handleSelectElement(element.id)}
                  enableResizing={{
                    bottom: true,
                    bottomLeft: true,
                    bottomRight: true,
                    left: true,
                    right: true,
                    top: true,
                    topLeft: true,
                    topRight: true
                  }}
                  lockAspectRatio={element.type === 'image'}
                  style={{
                    border: element.selected ? '2px solid #667eea' : 'none',
                    boxSizing: 'border-box'
                  }}
                  resizeHandleStyles={{
                    bottomRight: {
                      right: '-5px',
                      bottom: '-5px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#667eea',
                      borderRadius: '50%',
                      border: '2px solid white'
                    },
                    bottomLeft: {
                      left: '-5px',
                      bottom: '-5px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#667eea',
                      borderRadius: '50%',
                      border: '2px solid white'
                    },
                    topRight: {
                      right: '-5px',
                      top: '-5px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#667eea',
                      borderRadius: '50%',
                      border: '2px solid white'
                    },
                    topLeft: {
                      left: '-5px',
                      top: '-5px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#667eea',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }
                  }}
                >
                  {element.type === 'text' ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      color: element.color,
                      fontFamily: element.font,
                      fontSize: `${element.fontSize}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: element.alignment || 'center',
                      cursor: 'move',
                      opacity: element.opacity !== undefined ? element.opacity : 1,
                      textDecoration: element.textDecoration || 'none',
                      fontStyle: element.textDecoration === 'italic' ? 'italic' : 'normal',
                      userSelect: 'none'
                    }}>
                      {element.content}
                    </div>
                  ) : element.type === 'image' ? (
                    <img
                      src={element.src}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        cursor: 'move',
                        opacity: element.opacity !== undefined ? element.opacity : 1,
                        userSelect: 'none'
                      }}
                    />
                  ) : element.type === 'shape' ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.color,
                      opacity: element.opacity !== undefined ? element.opacity : 1,
                      cursor: 'move',
                      userSelect: 'none',
                      ...(element.shape === 'circle' && { borderRadius: '50%' }),
                      ...(element.shape === 'triangle' && {
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderLeft: `${elementWidth/2}px solid transparent`,
                        borderRight: `${elementWidth/2}px solid transparent`,
                        borderBottom: `${elementHeight}px solid ${element.color}`
                      }),
                      ...(element.shape === 'line' && {
                        height: '2px',
                        marginTop: `${elementHeight/2}px`
                      })
                    }} />
                  ) : null}
                </Rnd>
              );
            })}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ebf4ff 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(101, 119, 234, 0.1)'
      }}>
        <h4 style={{ 
          marginTop: 0, 
          color: '#4a5568',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Zone de personnalisation
        </h4>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div>
            <div style={{ 
              fontSize: '13px', 
              color: '#718096',
              marginBottom: '4px'
            }}>
              Emplacement
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#4a5568'
            }}>
              {activePosition.position_name || `Zone ${activePosition.position_id}`}
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: '13px', 
              color: '#718096',
              marginBottom: '4px'
            }}>
              Taille max
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#4a5568'
            }}>
              {activePosition.max_print_size_width}mm × {activePosition.max_print_size_height}mm
            </div>
          </div>
        </div>
        <div style={{ 
          marginTop: '12px',
          fontSize: '13px', 
          color: '#718096'
        }}>
          <strong>Astuce:</strong> Faites glisser et déposez vos éléments dans la zone en pointillés.
          Utilisez les poignées pour redimensionner.
        </div>
      </div>
    </Panel>
  );
}

function PersonaliserPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePosition, setActivePosition] = useState(null);
  const [designElements, setDesignElements] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Produit non trouvé');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        
        const positions = data.print_data_json?.printing_positions || data.print_data_json?.print_positions || [];
        if (positions.length > 0) {
          setActivePosition(positions[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddElement = (element) => {
    // Désélectionner tous les autres éléments
    const updatedElements = designElements.map(el => ({
      ...el,
      selected: false
    }));
    
    setDesignElements([...updatedElements, { ...element, selected: true }]);
  };

  const handleUpdateElement = (updatedElements) => {
    setDesignElements(updatedElements);
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#4a5568',
      background: '#f8fafc'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
          <path d="M12 2V6" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18V22" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L7.76 7.76" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.24 16.24L19.07 19.07" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H6" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 12H22" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 19.07L7.76 16.24" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.24 7.76L19.07 4.93" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Chargement du produit...
      </div>
    </div>
  );
  
  if (!product) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#4a5568',
      background: '#f8fafc'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '32px',
        borderRadius: '16px',
        background: 'white',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          fontSize: '48px',
          marginBottom: '16px'
        }}>😕</div>
        <h2 style={{ 
          margin: '0 0 8px 0',
          color: '#2d3748'
        }}>Produit introuvable</h2>
        <p style={{ 
          color: '#718096',
          margin: '0 0 24px 0'
        }}>Le produit que vous recherchez n'existe pas ou a été supprimé</p>
        <PrimaryButton 
          onClick={() => window.location.href = '/'}
          style={{ width: 'auto', padding: '12px 24px' }}
        >
          Retour à l'accueil
        </PrimaryButton>
      </div>
    </div>
  );

  const printPositions = product.print_data_json?.printing_positions || product.print_data_json?.print_positions || [];

  return (
    <Container>
      <Header>
        <Title>
          Personnaliser : {product.name}
          <span>Créez votre design unique</span>
        </Title>
        <StepBadge>
          Étape 2/3 - Personnalisation
        </StepBadge>
      </Header>

      <GridLayout>
        {/* Colonne de gauche - Vues du produit */}
        <Panel>
          <PanelTitle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Zones de personnalisation
          </PanelTitle>
          <PrintZoneContainer>
            {printPositions.length > 0 ? (
              printPositions.map((pos, i) => (
                <PrintZone 
                  key={i} 
                  position={pos} 
                  isActive={activePosition?.position_id === pos.position_id}
                  onClick={() => {
                    setActivePosition(pos);
                    // Désélectionner tous les éléments quand on change de zone
                    setDesignElements(designElements.map(el => ({
                      ...el,
                      selected: false
                    })));
                  }}
                />
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                color: '#718096', 
                fontSize: '14px',
                textAlign: 'center',
                padding: '32px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  Aucune zone de personnalisation disponible.<br />
                  Ce produit ne peut pas être personnalisé.
                </div>
              </div>
            )}
          </PrintZoneContainer>
        </Panel>

        {/* Colonne centrale - Aperçu du produit */}
        <div>
          <ProductPreview 
            product={product} 
            activePosition={activePosition} 
            designElements={designElements}
            onUpdateElement={handleUpdateElement}
          />
        </div>

        {/* Colonne de droite - Outils de personnalisation */}
        <div>
          <DesignEditor 
            activePosition={activePosition} 
            onAddElement={handleAddElement}
            designElements={designElements}
            onUpdateElement={handleUpdateElement}
          />
        </div>
      </GridLayout>
    </Container>
  );
}

export default PersonaliserPage;