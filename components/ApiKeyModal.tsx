import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface ApiKeyModalProps {
    mode: 'create' | 'edit';
    isApiKeyCreateAndUpdateModalOpen: boolean;
    setIsApiKeyCreateAndUpdateModalOpen: (open: boolean) => void;
    onSubmit: (name: string) => void;
}

export const CreateAndUpdateApiKeyModal: React.FC<ApiKeyModalProps> = ({
    mode,
    isApiKeyCreateAndUpdateModalOpen,
    setIsApiKeyCreateAndUpdateModalOpen,
    onSubmit,
}) => {
    const [name, setName] = useState('');
    const handleSubmit = () => {
        if (mode === 'create') {
            onSubmit(name);
        }
    };
    return (
        <Dialog open={isApiKeyCreateAndUpdateModalOpen} onOpenChange={setIsApiKeyCreateAndUpdateModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create' : 'Edit'} API Key</DialogTitle>
                    <DialogDescription>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="mt-6"
                            type="text"
                            placeholder="Enter name of API"
                        />
                        <Button className="mt-5" onClick={handleSubmit} disabled={!name}>
                            {mode === 'create' ? 'Create' : 'Edit'} key
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
