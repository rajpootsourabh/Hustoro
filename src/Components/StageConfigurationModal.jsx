// components/StageConfigurationModal.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    IconButton,
    Box,
    Typography,
    Chip,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SettingsIcon from '@mui/icons-material/Settings';
import { X } from 'lucide-react';

const StageConfigurationModal = ({
    open,
    onClose,
    stages,
    setStages,
    availableDocuments
}) => {
    const [showStageForm, setShowStageForm] = useState(false);
    const [currentStage, setCurrentStage] = useState({
        name: '',
        type: 'hiring',
        order: 1,
        documents: []
    });
    const [showSaveWarning, setShowSaveWarning] = useState(false); // Add this state

    // Function to handle closing and clearing everything (for Cancel/X button)
    const handleCancel = () => {
        // Clear all local state
        setShowStageForm(false);
        setCurrentStage({
            name: '',
            type: 'hiring',
            order: 1,
            documents: []
        });
        setShowSaveWarning(false); // Reset warning
        // Clear stages passed from parent
        setStages([]);
        // Call the original onClose
        onClose();
    };

    // Function to handle saving (keep the data)
    const handleSave = () => {
        // Check if stage form is open with unsaved data
        if (showStageForm && (currentStage.name.trim() || currentStage.documents.length > 0)) {
            setShowSaveWarning(true);
            return;
        }

        // Just close the modal without clearing data
        setShowStageForm(false);
        setCurrentStage({
            name: '',
            type: 'hiring',
            order: 1,
            documents: []
        });
        setShowSaveWarning(false); // Reset warning
        onClose();
    };

    // Clean up when modal closes - only clear local state
    useEffect(() => {
        if (!open) {
            setShowStageForm(false);
            setCurrentStage({
                name: '',
                type: 'hiring',
                order: 1,
                documents: []
            });
            setShowSaveWarning(false); // Reset warning
        }
    }, [open]);

    const addStage = () => {
        if (!currentStage.name.trim()) return;

        const newStage = {
            ...currentStage,
            order: stages.length + 1,
            documents: currentStage.documents.map((doc, index) => ({
                ...doc,
                order: index + 1
            }))
        };

        setStages([...stages, newStage]);
        setCurrentStage({
            name: '',
            type: 'hiring',
            order: stages.length + 2,
            documents: []
        });
        setShowStageForm(false);
        setShowSaveWarning(false); // Reset warning when stage is created
    };

    const removeStage = (index) => {
        const updatedStages = stages.filter((_, i) => i !== index)
            .map((stage, i) => ({ ...stage, order: i + 1 }));
        setStages(updatedStages);
    };

    const moveStage = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === stages.length - 1)) return;

        const updatedStages = [...stages];
        const temp = updatedStages[index];
        updatedStages[index] = updatedStages[index + direction];
        updatedStages[index + direction] = temp;

        const reorderedStages = updatedStages.map((stage, i) => ({ ...stage, order: i + 1 }));
        setStages(reorderedStages);
    };

    const toggleDocument = (documentCode, documentName) => {
        const isSelected = currentStage.documents.some(doc => doc.code === documentCode);

        if (isSelected) {
            setCurrentStage(prev => ({
                ...prev,
                documents: prev.documents.filter(doc => doc.code !== documentCode)
            }));
        } else {
            setCurrentStage(prev => ({
                ...prev,
                documents: [...prev.documents, {
                    code: documentCode,
                    name: documentName,
                    isRequired: true,
                    order: prev.documents.length + 1
                }]
            }));
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (sourceIndex === targetIndex) return;

        const updatedStages = [...stages];
        const [movedStage] = updatedStages.splice(sourceIndex, 1);
        updatedStages.splice(targetIndex, 0, movedStage);

        const reorderedStages = updatedStages.map((stage, index) => ({
            ...stage,
            order: index + 1
        }));

        setStages(reorderedStages);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel} // Use handleCancel for backdrop click
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2.5,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                }
            }}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <SettingsIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
                            Hiring Pipeline Setup
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                            Configure stages and document requirements
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleCancel} // Use handleCancel for X button
                    size="small"
                    sx={{
                        color: 'white',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: 2,
                        width: 32,
                        height: 32,
                        position: 'relative',
                        zIndex: 1,
                        '&:hover': {
                            background: 'rgba(255,255,255,0.3)',
                            transform: 'scale(1.05)'
                        }
                    }}
                >
                    <X size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, background: 'transparent' }}>
                <Box sx={{ mb: 1.8, mt: 2 }}>
                    {/* Header Section with Stats */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 0,
                            mb: 1,
                            background: 'transparent',
                            border: 'none',
                            boxShadow: 'none'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 1.5,
                            mb: 2,
                            justifyContent: 'space-between'
                        }}>
                            <Paper
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    background: 'white',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    minHeight: 60
                                }}
                            >
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1.5,
                                    background: 'rgba(13, 148, 136, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" fontWeight="700" color="primary.main">
                                        {stages.length}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Total Stages
                                    </Typography>
                                </Box>
                            </Paper>

                            <Paper
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    background: 'white',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    minHeight: 60
                                }}
                            >
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1.5,
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" fontWeight="700" color="success.main">
                                        {stages.reduce((acc, stage) => acc + stage.documents.length, 0)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Documents Required
                                    </Typography>
                                </Box>
                            </Paper>

                            <Paper
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    background: 'white',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    minHeight: 60
                                }}
                            >
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1.5,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" fontWeight="700" color="info.main">
                                        {availableDocuments.length}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Available Docs
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Paper>

                    {/* Add Stage Form */}
                    {showStageForm && (
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                mb: 3,
                                background: 'white',
                                borderRadius: 2,
                                border: showSaveWarning ? '2px solid' : '1px solid',
                                borderColor: showSaveWarning ? 'error.main' : 'teal',
                                boxShadow: '0 12px 32px -5px rgba(13, 148, 136, 0.15)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    // background: showSaveWarning ? 'error.main' : 'teal', // Change top border color
                                }
                            }}
                        >
                            {/* Warning message */}
                            {showSaveWarning && (
                                <Box sx={{
                                    mb: 2,
                                    p: 2,
                                    // background: 'rgba(244, 67, 54, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: '#d2b6b6ff'
                                }}>
                                    <Typography variant="body2" color="error.main" fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Please save or cancel the current stage before saving the pipeline
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="600" color={showSaveWarning ? 'error.main' : 'teal'}>
                                        Create New Stage
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Define stage details and document requirements
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setShowStageForm(false);
                                        setShowSaveWarning(false); // Reset warning when closing form
                                    }}
                                    color="inherit"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: '500',
                                        background: '#eddddd94',
                                        px: 2,
                                        '&:hover': {
                                            bgcolor: '#e8d3d3ff',
                                        }
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
                                        Stage Name *
                                    </Typography>
                                    <TextField
                                        value={currentStage.name}
                                        onChange={(e) => setCurrentStage(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Phone Screen, Technical Interview"
                                        fullWidth
                                        size="small"
                                        autoFocus
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                background: 'white'
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
                                        Stage Type
                                    </Typography>
                                    <Autocomplete
                                        options={[
                                            { label: 'Hiring Process', value: 'hiring' },
                                            { label: 'Onboarding', value: 'onboarding' },
                                            { label: 'Custom', value: 'custom' }
                                        ]}
                                        value={{
                                            label: currentStage.type === 'hiring' ? 'Hiring Process' :
                                                currentStage.type === 'onboarding' ? 'Onboarding' : 'Custom',
                                            value: currentStage.type
                                        }}
                                        onChange={(event, newValue) => {
                                            setCurrentStage(prev => ({ ...prev, type: newValue?.value || 'hiring' }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        background: 'white'
                                                    }
                                                }}
                                            />
                                        )}
                                        fullWidth
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2.5 }}>
                                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: 'text.primary' }}>
                                    Document Requirements
                                </Typography>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        maxHeight: 140,
                                        overflow: 'auto',
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                        borderRadius: 1.5,
                                        background: 'white',
                                        '&::-webkit-scrollbar': {
                                            width: 4,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'grey.100',
                                            borderRadius: 2
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: 'grey.300',
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(200px, 1fr))' },
                                        gap: 1
                                    }}>
                                        {availableDocuments.map((doc) => (
                                            <FormControlLabel
                                                key={doc.code}
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={currentStage.documents.some(d => d.code === doc.code)}
                                                        onChange={() => toggleDocument(doc.code, doc.name)}
                                                        sx={{
                                                            color: 'teal',
                                                            '&.Mui-checked': {
                                                                color: 'teal',
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: '500',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {doc.name}
                                                    </Typography>
                                                }
                                                sx={{
                                                    mr: 0.5,
                                                    px: 1,
                                                    py: 0.25,
                                                    borderRadius: 1,
                                                    '&:hover': {
                                                        bgcolor: 'grey.50',
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Box>

                            {currentStage.documents.length > 0 && (
                                <Box sx={{ mb: 3, p: 2, background: 'rgba(13, 148, 136, 0.05)', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: 'teal' }}>
                                        Selected Documents ({currentStage.documents.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {currentStage.documents.map((doc, index) => (
                                            <Chip
                                                key={doc.code}
                                                label={doc.name}
                                                size="small"
                                                onDelete={() => toggleDocument(doc.code, doc.name)}
                                                sx={{
                                                    borderRadius: 1,
                                                    borderColor: 'primary.main',
                                                    color: '#0d9488',
                                                    background: 'white',
                                                    fontWeight: '500',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                    height: 24,
                                                    '& .MuiChip-label': {
                                                        fontSize: '0.75rem',
                                                        px: 1,
                                                        py: 0.1,
                                                    },
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#0d9488',
                                                        fontSize: '1rem',
                                                        marginRight: '4px',
                                                        transition: '0.2s ease',
                                                        '&:hover': {
                                                            color: '#0f766e',
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={addStage}
                                    startIcon={<AddIcon />}
                                    disabled={!currentStage.name.trim()}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: '600',
                                        px: 4,
                                        py: 1,
                                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4)',
                                            transform: 'translateY(-1px)'
                                        },
                                        '&:disabled': {
                                            background: 'grey.300',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Create Stage
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    {/* Add Stage Button */}
                    {!showStageForm && stages.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setShowStageForm(true)}
                                disabled={stages.length >= 10}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: '600',
                                    py: 1.2,
                                    px: 2,
                                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                    color: 'white',
                                    minWidth: 200,
                                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)'
                                    },
                                    '&:disabled': {
                                        background: 'grey.300',
                                        color: 'grey.400',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                Add New Stage
                            </Button>
                        </Box>
                    )}

                    {/* Stages List */}
                    <Box>
                        {!showStageForm && stages.length === 0 ? (
                            <Paper
                                sx={{
                                    p: 5,
                                    textAlign: 'center',
                                    background: 'white',
                                    borderRadius: 3,
                                    border: '2px dashed',
                                    borderColor: 'grey.200',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(13, 148, 136, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(13, 148, 136, 0.08) 2%, transparent 0%)',
                                    backgroundSize: '100px 100px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -50,
                                        right: -50,
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0) 70%)',
                                    }
                                }}
                            >
                                {/* Animated Icon Container */}
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: '0 8px 25px rgba(13, 148, 136, 0.3)',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -4,
                                            left: -4,
                                            right: -4,
                                            bottom: -4,
                                            borderRadius: '50%',
                                            border: '2px solid rgba(13, 148, 136, 0.2)',
                                            animation: 'pulse 2s infinite',
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 2,
                                            background: 'rgba(255,255,255,0.9)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <AddIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                                    </Box>
                                </Box>

                                {/* Text Content */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 1,
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Build Your Hiring Pipeline
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        maxWidth: 600,
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        mb: 2,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Create your first stage to design a seamless hiring journey.
                                    Add documents and requirements for each step to streamline your process.
                                </Typography>

                                {/* CTA Button */}
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowStageForm(true)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: '700',
                                        py: 0.8,
                                        px: 2,
                                        fontSize: '1rem',
                                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                        boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 30px rgba(13, 148, 136, 0.5)'
                                        }
                                    }}
                                >
                                    Create First Stage
                                </Button>
                            </Paper>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {stages.map((stage, index) => (
                                    <Paper
                                        key={index}
                                        sx={{
                                            background: 'white',
                                            border: '2px solid',
                                            borderColor: 'grey.100',
                                            borderRadius: 3,
                                            p: 3,
                                            cursor: 'grab',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                bgcolor: 'white',
                                                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:active': {
                                                cursor: 'grabbing',
                                                transform: 'scale(0.998)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: 4,
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                            },
                                            '&:hover::before': {
                                                opacity: 1,
                                            }
                                        }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                            {/* Left Side - Order and Drag Handle */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {stage.order}
                                                </Box>
                                                <DragHandleIcon sx={{ color: 'text.secondary', opacity: 0.5 }} />
                                            </Box>

                                            {/* Middle Content - Stage Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Typography variant="h6" fontWeight="600" color="text.primary" sx={{
                                                        fontSize: '1.1rem',
                                                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                                                        backgroundClip: 'text',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent'
                                                    }}>
                                                        {stage.name}
                                                    </Typography>
                                                    <Chip
                                                        label={stage.type}
                                                        size="small"
                                                        color={
                                                            stage.type === 'hiring' ? 'primary' :
                                                                stage.type === 'onboarding' ? 'success' : 'default'
                                                        }
                                                        variant="filled"
                                                        sx={{
                                                            borderRadius: 2,
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize',
                                                            fontSize: '0.7rem',
                                                            height: 24,
                                                            '&.MuiChip-colorPrimary': {
                                                                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                                            }
                                                        }}
                                                    />
                                                </Box>

                                                {/* Documents Section */}
                                                {stage.documents.length > 0 ? (
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                            <Box sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: 1,
                                                                background: 'rgba(13, 148, 136, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Typography variant="caption" fontWeight="700" color="primary.main">
                                                                    {stage.documents.length}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary" fontWeight="600">
                                                                Required Documents
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {stage.documents.map((doc, docIndex) => (
                                                                <Chip
                                                                    key={docIndex}
                                                                    label={doc.name}
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        borderColor: 'teal',
                                                                        background: 'rgba(243, 202, 202, 0.24)',
                                                                        fontWeight: '500',
                                                                        height: 28,
                                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                        '& .MuiChip-label': {
                                                                            fontSize: '0.75rem',
                                                                            px: 1,
                                                                        },
                                                                        '&:hover': {
                                                                            background: 'rgba(236, 213, 200, 0.49)',
                                                                            transform: 'translateY(-1px)',
                                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                                        }
                                                                    }}
                                                                    icon={
                                                                        <Box sx={{
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: '50%',
                                                                            background: 'success.main',
                                                                            ml: 0.5
                                                                        }} />
                                                                    }
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 2,
                                                        background: 'grey.50',
                                                        borderRadius: 2,
                                                        border: '1px dashed',
                                                        borderColor: 'grey.300'
                                                    }}>
                                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                            📄 No documents required for this stage
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Right Side - Actions */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => moveStage(index, -1)}
                                                    color="teal"
                                                    disabled={index === 0}
                                                    title="Move up"
                                                    sx={{
                                                        background: 'rgba(13, 148, 136, 0.08)',
                                                        color: 'teal',
                                                        borderRadius: 2,
                                                        width: 36,
                                                        height: 36,
                                                        '&:hover': {
                                                            background: 'rgba(13, 148, 136, 0.15)',
                                                            transform: 'scale(1.05)',
                                                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                                                        },
                                                        '&:disabled': {
                                                            background: 'grey.100',
                                                            color: 'grey.400'
                                                        }
                                                    }}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => moveStage(index, 1)}
                                                    disabled={index === stages.length - 1}
                                                    color="teal"
                                                    title="Move down"
                                                    sx={{
                                                        background: 'rgba(13, 148, 136, 0.08)',
                                                        color: 'teal',
                                                        borderRadius: 2,
                                                        width: 36,
                                                        height: 36,
                                                        '&:hover': {
                                                            background: 'rgba(13, 148, 136, 0.15)',
                                                            transform: 'scale(1.05)',
                                                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                                                        },
                                                        '&:disabled': {
                                                            background: 'grey.100',
                                                            color: 'grey.400'
                                                        }
                                                    }}
                                                >
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeStage(index)}
                                                    title="Remove stage"
                                                    sx={{
                                                        background: 'rgba(244, 67, 54, 0.08)',
                                                        color: 'error.main',
                                                        borderRadius: 2,
                                                        width: 36,
                                                        height: 36,
                                                        '&:hover': {
                                                            background: 'rgba(244, 67, 54, 0.15)',
                                                            transform: 'scale(1.05)',
                                                            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                p: 3,
                borderTop: '1px solid',
                borderColor: 'grey.200',
                background: 'white',
                borderRadius: '0 0 12px 12px'
            }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: '600',
                        px: 4,
                        py: 1,
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={stages.length === 0} // Disable when no stages
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: '600',
                        px: 4,
                        py: 1,
                        background: stages.length === 0 ? 'grey.300' : (showSaveWarning ? 'error.main' : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'),
                        boxShadow: stages.length === 0 ? 'none' : (showSaveWarning ? '0 4px 12px rgba(244, 67, 54, 0.3)' : '0 4px 12px rgba(13, 148, 136, 0.3)'),
                        '&:hover': stages.length === 0 ? {} : {
                            boxShadow: showSaveWarning ? '0 8px 20px rgba(244, 67, 54, 0.4)' : '0 8px 20px rgba(13, 148, 136, 0.4)',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': {
                            background: 'grey.300',
                            color: 'grey.400',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Save Pipeline
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StageConfigurationModal;