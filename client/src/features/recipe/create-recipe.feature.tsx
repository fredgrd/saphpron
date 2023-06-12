import React, { useContext, useRef, useState } from 'react';
import { Recipe } from '../../models/recipe.model';
import './recipe-infos.feature.css';

import ImagePreview from '../../assets/image-preview.png';
import CloudinaryService from '../../services/cloudinary.service';
import SimpleInput from '../../components/simple-input/simple-input.component';
import BigButton from '../../components/big-button/big-button.component';
import RecipeService from '../../services/recipe.service';
import { ToastContext } from '../../context/tost.context';

const CreateRecipe: React.FC<{ set: (recipe: Recipe) => void }> = ({ set }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File>();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [time, setTime] = useState<number>(1);
  const [cloudinaryService] = useState<CloudinaryService>(
    new CloudinaryService()
  );
  const [recipeService] = useState<RecipeService>(new RecipeService());
  const toastContext = useContext(ToastContext);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;

    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const file: File = event.target.files[0];
    setImageFile(file);
  };

  const onCreate = async () => {
    if (loading) return;
    setLoading(true);

    if (!name) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Fill at least the name field`,
      });
      return;
    }

    if (imageFile) {
      var { url, error: cloudinaryError } = await cloudinaryService.uploadImage(
        imageFile!
      );

      if (cloudinaryError) {
        setLoading(false);
        toastContext.update({
          isVisible: true,
          message: `Error creating recipe: ${cloudinaryError}`,
        });
        return;
      }

      if (!url) {
        setLoading(false);
        toastContext.update({
          isVisible: true,
          message: 'Error creating recipe',
        });
        return;
      }
    }

    const { recipe, error } = await recipeService.create({
      name,
      description,
      prep_time: time,
      media_url: url,
    });

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error creating recipe: ${error}`,
      });
      return;
    }

    if (!recipe) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: 'Error creating recipe',
      });
      return;
    }

    setLoading(false);
    set(recipe);
  };

  return (
    <div className="recipeinfos">
      <div className="recipeinfos__header">INFOS</div>
      <div className="recipeinfos__container">
        <div
          className="recipeinfos__image"
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={onSelectImage}
          />
          <img
            className="recipeinfos__image__preview"
            src={imageFile ? URL.createObjectURL(imageFile) : ImagePreview}
          />
        </div>
        <div className="recipeinfos__info">
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={setName}
              value={name}
              options={{ title: 'Name', type: 'text' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={setDescription}
              value={description}
              options={{ title: 'Description', type: 'text' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <SimpleInput
              onChange={(time) => setTime((time as number) > 0 ? time : 1)}
              value={time}
              options={{ title: 'Preparation time', type: 'number' }}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BigButton title="CREATE" isLoading={loading} onClick={onCreate} />
      </div>
    </div>
  );
};

export default CreateRecipe;
